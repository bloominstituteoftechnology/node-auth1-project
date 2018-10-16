// imports
const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");

// instantiate server
const server = express();
server.use(express.json());

// middleware
// session
server.use(
  session({
    name: "notsession",
    secret: "nobody tosses a dwarf!",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
  })
);

const protected = (req, res, next) => {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "you shall not pass!" });
  }
};

// endpoints
server.post("/api/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 10);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(ids => {
      req.session.username = user.username;
      res.status(201).json(ids[0]);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get("/api/users", protected, (req, res) => {
  db("users")
    .then(users => res.status(201).json(users))
    .catch(err => express.status(500).json(err));
});

// server port
server.listen(9000, () => {
  console.log("Server is running on port 9000");
});

// knex
const knex = require("knex");
const knexConfig = require("./knexfile");
const db = knex(knexConfig.development);
