const express = require("express");
const session = require("express-session");
const User = require("./user");
const bcrypt = require("bcrypt");
const cors = require("cors");

const STATUS_USER_ERROR = 422;

const server = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
server.use(cors(corsOptions));

// to enable parsing of json bodies for post requests
server.use(express.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    resave: true,
    saveUninitialized: true,
  }),
);

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};
/* ************ MiddleWares ***************** */

const loggedIn = (req, res, next) => {
  const { username } = req.session;
  console.log(req.session);
  if (!username) {
    sendUserError("User is not logged in", res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError("User does exist", res);
    } else {
      req.user = user;
      next();
    }
  });
};

const restrictedPermissions = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      sendUserError("You shall not pass", res);
      return;
    }
  }
  next();
};

server.use(restrictedPermissions);

/* ************ Routes ***************** */

// TODO: implement routes
server.post("/users", (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, passwordHash: password });
  newUser.save((err, savedUser) => {
    if (err) {
      return sendUserError(err, res);
    }
    res.json(savedUser);
  });
});

server.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError("username undefined", res);
    return;
  }
  User.findOne({ username })
    .then(user => {
      user.checkPassword(password, err => {
        if (err) {
          return sendUserError(err, res);
        } else if (username === null) {
          return sendUserError("User does not exist", res);
        } else {
          res.json({ success: true });
          req.session.username = username;
          req.user = user;
        }
      });
    })
    .catch(error => {
      return sendUserError("Error logging in", res);
    });
});

server.post("/logout", (req, res) => {
  if (!req.session.username) {
    sendUserError("User is not logged in", res);
    return;
  }
  req.session.username = null;
  res.json(req.session);
});

server.get("/restricted/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      sendUserError("500", res);
      return;
    }
    res.json(users);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way
  res.send({ user: req.user, session: req.session });
});

module.exports = { server };
