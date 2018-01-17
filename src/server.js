/* eslint-disable */

const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const User = require("./user.js");
const bcrypt = require("bcrypt");
const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re"
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

const passwordEncrypt = (req, res, next) => {
  const { password } = req.body;
  console.log("req.body and pw", req.body, password);
  bcrypt
    .hash(password, 11)
    .then(hash => {
      req.hash = hash;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
};

const passwordCompare = (res, req, next) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError("username undefined");
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || !username) {
      sendUserError();
      return;
    }
    const hashedPw = user.password;
    bcrypt
      .compare(password, hashedPw)
      .then(res => {
        if (!res) throw new Error();
        req.user = user.email;
        next();
      })
      .catch(err => {
        res.status(422).json(err);
      });
  });
};

// TODO: implement routes

server.post("/users", passwordEncrypt, (req, res) => {
  const { username, password } = req.body;
  const passwordHash = req.hash;
  const newUser = new User({ username, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ "Username and password needed": err.message });
      return;
    }
    res.json(savedUser);
  });

  console.log("req.hash", req.hash);
  res.json({ success: true });
});

server.post("/log-in", passwordCompare, (req, res) => {
  res.json({ success: true });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
