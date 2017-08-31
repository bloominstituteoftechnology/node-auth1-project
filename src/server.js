const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const User = require("./user");
const bcrypt = require("bcrypt");
const cors = require("cors");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(cors());
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

const middleVerification = (req, res, next) => {
  const sess = req.session;
  if (!sess.LoginId) {
    sendUserError("Please log in", res);
    return;
  }
  User.findById(sess.LoginId, (err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    req.user = user;
    next();
  });
};

server.use("/restricted/*", (req, res, next) => {
  const sess = req.session;
  if (!sess.LoginId) {
    sendUserError("Please log in", res);
    return;
  }
  User.findById(sess.LoginId, (err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    req.user = user;
  });
});

// TODO: implement routes
server.post("/users", (req, res) => {
  // getting the username and password from a user
  const { username, password } = req.body;
  // Check if the password is empty
  if (password === "") {
    sendUserError("Please input a valid password", res);
    return;
  }
  // hash the password
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    // const passwordHash = hPassword;
    const newUser = new User({ username, passwordHash });
    newUser.save((error, user) => {
      if (error) {
        sendUserError(error, res);
        return;
      }
      res.json(user);
    });
  });
});
server.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sess = req.session;
  if (!password || password === "") {
    sendUserError("Please input a valid password", res);
  }
  if (!username) {
    sendUserError("Please input username", res);
  }
  // hash the password
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    if (!user) {
      sendUserError("Please input valid info", res);
      return;
    }
    if (bcrypt.compareSync(password, user.passwordHash)) {
      sess.LoginId = user.id;
      res.json({ success: true });
      return;
    }
    sendUserError("Crap password", res);
  });
});

server.post("/logout", (req, res) => {
  sess.LoginId = null;
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", middleVerification, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get("/restricted/*", (req, res) => {
  res.json({ hidden: "hidden" });
});

module.exports = { server };
