/* eslint-disable */
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./user");
const cors = require("cors");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
server.use(cors(corsOptions));
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    resave: true,
    saveUninitialized: true
  })
);

const checkAuth = (req, res, next) => {
  User.find({ username: req.session.user })
    .then(activeUser => {
      if (activeUser.length) {
        req.user = req.session.user;
        next();
      } else {
        sendUserError({ message: "You must be logged in" }, res);
      }
    })
    .catch(err => {
      sendUserError({ message: "User not found" }, res);
    });
};

// Stretch - restricted Global middleware
server.use("/restricted", checkAuth, (req, res, next) => {});

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  // res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
    return;
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes
server.post("/users", (req, res) => {
  const { username, password } = req.body;
  if (!password || !username) {
    sendUserError(
      { message: " make sure to send the username and password" },
      res
    );
  }
  const user = new User({ username, password });
  user
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      return sendUserError(
        { message: "something went wrong creating the user" },
        res
      );
    });
});

server.post("/login", (req, res) => {
  const { username, password } = req.body;
  const session = req.session;
  if (!username || !password) {
    sendUserError();
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err);
    }
    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        sendUserError(err);
      }
      if (isMatch) {
        req.session.user = user.username;
        req.session.loggedIn = true;
        res.status(200).json({ isLoggedIn: true });
      } else {
        res.status(401).json({ isLoggedIn: false });
      }
    });
  }).catch(err => {
    sendUserError();
  });
});

server.post("/logout", checkAuth, (req, res) => {
  req.session.destroy((err, success) => {
    if (err) {
      sendUserError(err);
    } else {
      res.send({ message: "Session Destroyed" });
    }
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", checkAuth, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
