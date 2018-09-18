const express = require("express");
const server = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db/dbConfig.js");
const session = require("express-session");
const config = require("./config/middleware");

const KnexSessionStore = require("connect-session-knex")(session);

server.use(express.json());
server.use(cors());
// server.use();
config(server); 

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

//router post

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
    .catch(err => res.json({ message: "Please login to access information" }));
});

server.listen(8000, () => console.log("========API running on 8000======="));
