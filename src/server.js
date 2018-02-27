/* eslint-disable */
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./user");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    resave: true,
    saveUninitialized: true,
    cookie: { username: null }
  })
);

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes
server.post("/users", (req, res) => {
  const { username, password } = req.body;
  if (!password || !username) {
    sendUserError(
      { message: "Please provide a username and a password", stack: "IDK" },
      res
    );
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    User.create({ username, passwordHash: hash })
      .then(result => {
        res.status(200).json(result);
      })
      .catch((err, res) => {
        sendUserError(err, res);
      });
  });
});

server.post("/log-in", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError(
      { message: "Please provide a username and a password", stack: "IDK" },
      res
    );
  }
  User.findOne({ username })
    .then(user => {
      bcrypt
        .compare(password, user.passwordHash)
        .then(flag => {
          if (flag) {
            //log in
            req.session.user = username;
            console.log("User: ", req.session.user);
            res.status(200).json({ success: true });
          } else {
            // send error not found
            sendUserError({ message: "Username or password not correct" }, res);
          }
        })
        .catch(err => {
          sendUserError({ err }, res);
        });
    })
    .catch(err => {
      sendUserError({ message: "Cannot find username" }, res);
    });
});

const checkAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    sendUserError({ message: "You must be logged in to do that action" });
  }
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", checkAuth, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
