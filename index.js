const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const db = require("./db/dbConfig.js");

const server = express();

const sessionConfig = {
  name: "macadamian",
  secret: "horde FTW!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
};
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.post("/api/register", (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 10);

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
        res.status(200).send(`welcome ${req.session.username}`);
      } else {
        res.status(401).json({ message: "you shall not pass!" });
      }
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/setname", (req, res) => {
  req.session.name = "Frodo";
  res.send(`acquired name as ${req.session.name}`);
});

server.get("/api/greet", (req, res) => {
  const name = req.session.username;
  res.send(`hello ${name}`);
});

server.get("/api/users", (req, res) => {
  if (req.session && req.session.username) {
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  } else {
    res.status(401).json({ message: "youre not authorized!" });
  }
});

server.get("/api/admins", (req, res) => {
  // only send the list of users if the client is logged in
  //user = {username: 'foo', role:'admin'}

  if (req.session && req.session.role === "admin") {
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  } else {
    res.status(403).json({ message: "you are forbidden" });
  }
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
