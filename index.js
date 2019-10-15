const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require('express-session')

const db = require("./data/dbConfig");
const Users = require("./users/users-model");

const server = express();

const sessionConfig = {
  name: 'superCookie',
  secret: 'super duper secret',
  cookie: {
    maxAge: 1000 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.get("/", (req, res) => {
  res.send("It's working!");
});

server.post("/api/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  if (username && password) {
    Users.FindBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.user = user
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: "must provide valid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({ message: "please provide username and password" });
  }
});

server.get("/api/users", protected, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

function protected(req, res, next) {
  let { username, password } = req.headers;

  if (req.session && req.session.user) {
    // Users.FindBy({ username })
    //   .first()
    //   .then(user => {
    //     if (user && bcrypt.compareSync(password, user.password)) {
    //       next();
    //     } else {
    //       res.status(401).json({ message: "You shall not pass!" });
    //     }
    //   })
    //   .catch(error => {
    //     res.status(500).json(error);
    //   });
    next()
  } else {
    res.status(401).json({ message: "you are not authorized to access this info" });
  }
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
