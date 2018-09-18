const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db/dbConfig.js");
const session = require("express-session");
const server = express();

const KnexSessionStore = require("connect-session-knex")(session);

server.use(express.json());
server.use(cors());

const sessionConfig = {
  name: "banana", // default is connect.sid
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid", //what is this line of code?
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(session(sessionConfig));

auth = (req, res, next) => {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "go back to the shadows!" });
  }
};

server.get("/", (req, res) => {
  res.send("hello world");
});

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 12);
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
        res.status(200).json(`Welcome ${creds.username}`);
      } else {
        res
          .status(401)
          .json({ message: "You shall not pass! Go Back to the Shadows!" });
      }
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/users", auth, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(8000, () => console.log("========API running on 8000======="));
