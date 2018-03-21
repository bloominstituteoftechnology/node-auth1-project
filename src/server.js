/* eslint-disable */
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");

const STATUS_USER_ERROR = 422;

const User = require("./user.js");

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    authed: false,
    resave: true,
    saveUninitialized: false
  })
);

const authenticateUserMW = async function(req, res, next) {
  const session = req.session;
  if (session.secret === req.headers["cookie"]) {
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
    console.log(
      `The value of req.session.secret is ${req.session.secret}`,
      `The value of req.headers['cookie'] is ${req.headers["cookie"]}`
    );
    if (req.session.secret === req.headers["cookie"]) {
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

server.post("/users/:username&:password", async function(req, res) {
  const { username, password } = req.params;
  const newUser = new User({ username, passwordHash: password });
  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    sendUserError(err, res);
  }
});

server.post("/log-in/:username&:password", async function(req, res) {
  const { username, password } = req.params;
  try {
    const userToLogin = await User.findOne({ username: username });
    const doesPasswordMatch = await userToLogin.checkPassword(password);
    if (doesPasswordMatch) {
      const session = req.session;
      session.username = username;
      session.secret = req.headers["cookie"];
      res.status(500).send({ success: true });
    } else {
      res.status(406).send({ message: "Passwords don't match" });
    }
  } catch (err) {
    sendUserError(err);
  }
});

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
