const express = require("express");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");

const server = express();

const sessionConfig = {
  name: "login",
  secret: "asfjaofuwruq04r3oj;ljg049fjq30j4jlajg40j40tjojasl;kjg",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user =>
      user && bcrypt.compareSync(creds.password, user.password)
        ? res.status(200).json({ message: "Login successful." })
        : res.status(401).json({ message: "Invalid username or password." })
    )
    .catch(err => res.json(err));
});

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 8);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => res.status(201).json(ids))
    .catch(err => json(err));
});

const protected = (req, res, next) =>
  req.session && req.session.use
    ? next()
    : res.status(401).json({ message: "Please log in." });

server.get("/api/me", protected, (req, res) =>
  db("users")
    .select("id", "username", "password")
    .where({ id: req.session.user })
    .first()
    .then(users => res.json(users))
    .catch(err => res.send(err))
);

server.get("/api/users", protected, (req, res) =>
  db("users")
    .select("id", "username", "password")
    .then(users => res.json(users))
    .catch(err => res.send(err))
);

server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
