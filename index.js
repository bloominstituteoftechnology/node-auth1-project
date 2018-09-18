const express = require("express");
const cors = require("cors");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const db = knex(knexConfig.development);
const server = express();
server.use(express.json());
server.use(cors());
const sessionConfig = {
  name: "login",
  secret: "I eat whales",
  cookie: {
    loggedIn: true,
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

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

server.get("/api/users", protected, (req, res) => {
  db("users")
    .select()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
});

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 4);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send(`Welcome, ${req.session.username}`);
      } else {
        res.status(401).json({ message: "Username or password is incorrect" });
      }
    });
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});

//Admins

server.get("/api/admins", (req, res) => {
  db("admins")
    .select()
    .then(admins => {
      res.status(200).json(admins);
    })
    .catch(err => res.status(500).json(err));
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
