const express = require("express");
const knex = require("knex");
const bcrpyt = require("bcryptjs");
const knexConfig = require("../knexfile").development;
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const db = knex(knexConfig);
const router = express.Router();

const sessionConfig = {
  store: new knexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  }),
  secret: "nobody.tosses.a.dwarf.!",
  name: "monkey",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if doing https
    maxAge: 1000 * 60 * 60 * 24 * 10
  }
};

const protected = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "Invalid login attempt" });
    return;
  }
};

router.use(session(sessionConfig));

router.post("/register", (req, res) => {
  if (req.session.username) {
    res.status(401).json({ message: "You are already logged in." });
    return;
  }
  const creds = req.body;
  if (creds.password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  } else {
    const hashedPassword = bcrpyt.hashSync(creds.password, 16);
    creds.password = hashedPassword;
    db("users")
      .insert(creds)
      .then(ids => {
        res.status(201).json({
          message: `User with Username: ${creds.username}, Password: ${
            creds.password
          } signed up and logged in.`,
          count: ids[0]
        });
      })
      .catch(err => res.status(500).json(err));
  }
});

router.get("/users", protected, (req, res) => {
  db.raw(`SELECT * FROM users`)
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

router.get("/users/:username", protected, (req, res) => {
  const { username } = req.params;
  db("users")
    .select("username", "id")
    .where({ username })
    .first()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

router.delete("/users/:username", (req, res) => {
  db("users")
    .where({ username: req.params.username })
    .first()
    .del()
    .then(count => res.status(200).json(count))
    .catch(err => res.status(500).json(err));
});

router.post("/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrpyt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        console.log(req.session.username);
        res.status(201).json({
          message: `Welome ${user.username[0].toUpperCase() +
            user.username.slice(1, user.username.length)}`,
          isLoggedIn: true
        });
      } else {
        res
          .status(400)
          .json({ message: "Invalid username or password", isLoggedIn: false });
      }
    })
    .catch(err => res.status(500).message({ message: err }));
});

router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ message: "Failed to logout" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

module.exports = router;
