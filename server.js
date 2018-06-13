const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const User = require("./Models/UserModel");

mongoose.connect("mongodb://localhost/auth").then(() => {
  console.log(`\n ************ Connected to DB ************* \n`);
});

const server = express();

// Middleware

const sessionOptions = {
  secret: "it's a secret!",
  cookie: {
    maxAge: 1000 * 60 * 60 // this is equal to one hour
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: "SuperSecretDB"
};

server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "No Entry" });
  }
}



server.get("/", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(error => res.json(error));
});

server.get("/api/users", protected, (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(error => res.json(error));
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.send("error logging out");
      } else {
        res.send("You have been logged out");
      }
    });
  }
});

server.post("/api/register", (req, res) => {
  User.create(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .validatePassword(password)
          .then(passMatch => {
            if (passMatch) {
              req.session.username = user.username;
              res.send("Login successful");
            } else {
              res.status(401).send("Invalid Credentials");
            }
          })
          .catch(error => {
            res.send("Error comparing Passwords");
          });
      } else {
        res.status(404).send("Invalid Credentials");
      }
    })
    .catch(error => {
      res.send(error);
    });
});

server.listen(8000, () => {
  console.log(`\n ************ API Running on Port 8000 ************** \n`);
});
