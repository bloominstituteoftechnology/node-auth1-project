const express = require("express");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const bcrypt = require("bcryptjs"); // *************************** added package and required it here

const db = require("./database/dbConfig.js");

const server = express();

const sessionConfig = {
  name: "monkey",
  secret: "asfjaofuwruq04r3oj;ljg049fjq30j4jlajg40j40tjojasl;kjg",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false // only set it over https; in production you want this true.
  },
  httpOnly: true, // no js can touch this cookie
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

server.post("/api/register", (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 4);

  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      console.log(err);
    });
});

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.user = user.id;
        res.status(200).json({ message: "Welcome! " });
      } else {
        res.status(401).json({ message: "can't login" });
      }
    })
    .catch(err => res.json(err));
});

server.get("/api/users", (req, res) => {
  if (req.session && req.session.user) {
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  }
});

server.listen(9000, () => console.log("running on port 9k"));
