const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const User = require("./users/User");

mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => {
    console.log("\n=== connected to mongo ===\n");
  })
  .catch(err => console.log("error connecting to mongo", err));

const server = express();

function authenticate(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).send("You shall not pass!!!");
  }
}

const sessionConfig = {
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: "noname",
  store: new MongoStore({
    url: "mongodb://localhost/sessions",
    ttl: 60 * 10
  })
};

server.use(express.json());
server.use(session(sessionConfig));

server.get("/", (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back ${req.session.username}`);
  } else {
    res.send("who are you? who, who?");
  }
});

server.post("/register", function(req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        // compare the passwords
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username;
            res.send("have a cookie");
          } else {
            res.status(401).send("invalid password");
          }
        });
      } else {
        res.status(401).send("invalid username");
      }
    })
    .catch(err => res.send(err));
});

server.get("/users", authenticate, (req, res) => {
  User.find().then(users => res.send(users));
});

server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.send("error");
      } else {
        res.send("good bye");
      }
    });
  }
});

server.listen(8000, () => console.log("\n=== api running on 8k ===\n"));
