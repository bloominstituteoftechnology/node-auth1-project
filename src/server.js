/* eslint-disable */
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");

const STATUS_USER_ERROR = 422;

const User = require("./user.js");

const server = express();

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    authed: false,
    resave: true,
    saveUninitialized: true,
  })
);

const authenticateUserMW = async function(req, res, next) {
  const session = req.session;
  if (session.username) {
    try {
      const currentUser = await User.findOne({ username: session.username });
      req.user = currentUser;
      next();
    } catch (err) {
      sendUserError(err, res);
    }
  } else {
    res.status(500).send({ errorMessage: "Ya dun goofed" });
  }
};

const restrictedAccess = (req, res, next) => {
  const path = req.path.split("/");
  if (path[1] === "restricted") {
    if (req.session.username) {
      next();
    } else {
      res.status(403).send({ message: "You're not logged in" });
    }
  } else {
    next();
  }
};

server.use(restrictedAccess);

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

server.post("/users", async function(req, res) {
  const { username, password } = req.body;
  const newUser = new User({ username, passwordHash: password });
  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    sendUserError(err, res);
  }
});

server.post("/login", async function(req, res) {
  const { username, password } = req.body;
  try {
    const userToLogin = await User.findOne({ username: username });
    const doesPasswordMatch = await userToLogin.checkPassword(password);
    if (doesPasswordMatch) {
      req.session.username = username;
      res.status(500).send({ success: true });
    } else {
      res.status(406).send({ message: "Passwords don't match" });
    }
  } catch (err) {
    sendUserError(err);
  }
});

server.post("/logout/", function(req, res) {
  delete req.session.username;
  res.status(200).send({ message: "Logged out!" });
})

server.get("/restricted/dev", async function(req, res) {
  // res.send(req.session);
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (err) {
    sendUserError(err);
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", authenticateUserMW, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
