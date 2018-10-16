const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const db = require("./database/dbConfig.js");
const server = express();
const KnexSessionStore=require('connect-session-knex')(session);

const helmet = require('helmet')
server.use(express.json());
server.use(cors({ origin: "http://localhost:3000" }));


const serverLogger = (req, res, next) => {
  console.log(
    `\n\n\nIncoming Request:\n\nurl: ${req.url}\n\nmethod: ${
    req.method
    }\n\nbody:`
  );
  console.log(req.body);
  next();
};
server.get("/", (req, res) => {
  res.send("Server Running");
});
const sessionConfig = {
  name: "cica",
  secret: "keyboard.cica",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false
  },
   
store: new KnexSessionStore({
  tablename: "sessions",
  sidfieldname: "sid",
  knex: db,
  createtable: true,
  clearInterval: 1 * 24 * 60 * 60 * 1000,
}),
};
server.use(session(sessionConfig));      
function protection (req, res, next) {
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
      console.log(creds);
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .select("id", "username", "password")
    .then(user => {
      console.log(user, creds);
      if (user && user[0] && bcrypt.compareSync(creds.password, user[0].password)) {
        req.session.username = user[0].username;
        res.status(200).send(`Welcome back ${req.session.username}`);
      } else {
        res.status(401).json({ message: "No pass..." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});
server.get("/api/users", protection, (req, res) => {
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
        res.send("'You just got out!!'");
      }
    });
  }
});

server.listen(5500, () => console.log("\nrunning on port 5500\n"));
