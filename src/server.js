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
    saveUninitialized: true
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
  if (!password) {
    sendUserError({ message: "Please provide a password", stack: "IDK" }, res);
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

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
