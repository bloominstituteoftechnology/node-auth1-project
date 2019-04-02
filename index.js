//server moduke
const express = require("express");
//security module
const helmet = require("helmet");
//cors?
const cors = require("cors");
//password cryptography
const bcrypt = require("bcryptjs");
//database model
const Users = require("./database/users/users-model.js");
//server initialize
const server = express();
//middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

//server CRUD--------------------------------------------------------------
//root GET
server.get("/", (req, res) => {
  res.send("Server Running");
});

//POST create user/password
server.post("/api/register", (req, res) => {
  let user = req.body;
  //hashing method
  const hash = bcrypt.hashSync(user.password, 4);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//POST Login
server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // check tha password guess against the database
      //comparesync, password goes firs to 'pass' then user.password
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//GET users with user credentials
server.get(
  "/api/users",
  restricted,
  //ONLY for specific user
  //  only('Meow'),
  (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  }
);
//ONLY function for GET users
function only(username) {
  return function(req, res, next) {
    if (req.headers.username === username) {
      next();
    } else {
      res.status(403).json({ message: `you are not ${username}` });
    }
  };
}
//RESTRICTED function for GET users
function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        // check tha password guess against the database
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You shall not pass!!" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ message: "Please provide credentials" });
  }
}

//server port
const port = process.env.PORT || 7900;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
