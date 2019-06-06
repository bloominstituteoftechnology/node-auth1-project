const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");
const Users = require("./users/users-model.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("This is an API!");
});

server.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(addedUser => {
      res.status(201).json(addedUser);
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot create account" });
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res
          .status(200)
          .json({ message: `Welcome to Claire's API, ${user.username}` });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Try again!" });
    });
});

function restricted(req, res, next) {
  const { username, password } = req.headers;
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res
            .status(401)
            .json({ message: "Invalid Credentials. You shall not pass!" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "Did you even provide a password?" });
      });
  } else {
    res.status(400).json({ message: "Why didn't you put in credentials?" });
  }
}

server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(404).json({ message: "Not found!!" });
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\n** Running on port ${port} **\n`);
});
