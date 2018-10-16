const express = require("express");

const knex = require("knex");
const router = express.Router();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const knexConfig = require("../knexfile.js");

const db = knex(knexConfig.development);

const sessionConfig = {
  secret: "b.a.n.a.n.a.s",
  name: "monkey",
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
router.use(session(sessionConfig));

//Register a user
router.post("/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 10);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = user.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Login a registered user
router.post("/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: "Logged In!" });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    });
});

//Logout a user
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("You cannot leave");
      } else {
        res.status(200).json({ message: "Logged Out!" });
      }
    });
  }
});

//Get a list of all registered users
router.get("/users", protected, (req, res) => {
  console.log(req.session);

  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//Middleware for protected endpoints
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({
      message: "Not Authorized"
    });
  }
}

module.exports = router;
