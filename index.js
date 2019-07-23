const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const Users = require("./users-model.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const session = require('express-session');

server.use(session({
  name: 'uID',
  secret: 'Very very very yery long secret',
  cookie: {
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
}));
server.use(cors());

function protected(req, res, next) {
  if (req.session && req.session.uID) {
    next();
  } else {
    res.status(401).json({ message: 'Please log in' });
  }
}


async function authUser(req, res, next) {
  try {
    const user = Users.findUserByName(req.body.username);
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      req.user = user;
      next();
    } else {
      return res.status(400).json({ message: "You shall not pass!" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
}

function checkCredentials(req, res, next) {
  if (req.body.username && req.body.password) {  
    next();
  } else if (!req.body.password) {
    return res.status(400).json({ message: "Missing password" });
  } else {
    return res.status(400).json({ message: "Missing username" });
  }
}

function hashPassword (req, res, next) {
  req.body.hashedPassword = bcrypt.hashSync(req.body.password, 12);
  next();
}

server.get("/users", protected, async (req, res) => {
  try {
    const users = await Users.getUsers();
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "no users found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

server.post("/register", checkCredentials, hashPassword, async (req, res) => {
  try {
    const newUser = await Users.registerUser({
      username: req.body.username,
      password: req.body.hashedPassword
    });
    if (newUser) {
      return res.status(201).json({ message: "registration successful" });
    } else {
      return res.status(400).json({ message: "registration failed" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

server.post("/login", checkCredentials, authUser, async (req, res) => {
  try {
    if (req.user.id === ) {
      return res
        .status(200).set({
                'Set-Cookie': `uID=${req.user.id}`
               })
        .json({ message: "login successful"});
    } else {
      return res.status(400).json({ message: "login failed" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('Logout failed!');
      } else {
        res.send('Logout complete!');
      }
    });
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
