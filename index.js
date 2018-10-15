const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const db = require("./database/dbConfig.js");
const server = express();
const helmet = require("helmet");
server.use(express.json());
server.use(cors());
const KnexSessionStore = require("connect-session-knex")(session);
server.get("/", (req, res) => {
  res.send("Server Running");
});
const sessionConfig = {
  name: "",
  secret: "keyboard cica",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
};
server.use(session(sessionConfig));
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "no pass!!!" });
  }
}
server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
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
  console.log(creds.username)
  db("users")
    .where({ username: creds.username })
    .select('id')
    .then(user => {
        console.log(user)
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send(`Welcome back ${req.session.username}`);
      } else {
        res.status(401).json({ message: "No pass...:(" });
      }
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    });
});
server.get("/api/users", protected, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("beat it no one wants to be defeated ");
      }
    });
  }
});

server.listen(5500, () => console.log("\nrunning on port 5500\n"));
