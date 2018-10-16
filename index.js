const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const knexConfig = require("./knexfile.js");
const knex = require("knex");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
  secret: "dont-steal.my%secret!",
  name: "someWierdAnimal",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1
  },
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
server.use(cors(), helmet());

// The Sanity Check
server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("You Can't Leave!!! HAHAHAHA");
      } else {
        res.send("See Ya");
      }
    });
  }
});

server.post("/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      req.session.username = creds.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post("/login", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ hello: user.username });
      } else {
        res.status(401).json({ message: "you get no access you dirty hacker" });
      }
    });
});

server.get("/api/users", protected, (req, res) => {
  if (req.session && req.session.username) {
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  } else {
    res.status(401).send("Not Authorized");
  }
});

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
}

server.listen(8000, () => console.log("\nrunning on port 8000\n"));
