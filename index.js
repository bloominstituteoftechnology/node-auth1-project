const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const db = require("./dbConfig");
const server = express();

const sessionConfig = {
  name: "monkey", // default is connect.sid
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
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

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
}

server.get("/", (req, res) => {
  res.send("Working");
});

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
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
        res.session.username = user.username;
        res.status(200).send(`You are authenticated ${req.session.username}`);
      } else {
        res.status(401).json({ message: "Access Denied" });
      }
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("good bye");
      }
    });
  }
});

server.get("/setname", (req, res) => {
  req.session.name = "Frodo";
  res.send("got it");
});

server.get("/greet", (req, res) => {
  const name = req.session.username;
  res.send(`hello ${name}`);
});

server.get("/api/users", protected, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/admins", protected, (req, res) => {
  if (req.session && req.session.role === "admin") {
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  } else {
    res.status(403).json({ message: "You do not have access" });
  }
});

const port = 8000;
server.listen(port, () => console.log(`\n Listening on port ${port} \n`));
