const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const User = require("./user.js");

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    name: "auth",
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    secure: false,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      url: "mongodb://localhost/sessions",
      ttl: 10 * 60
    })
  })
);

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));

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

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get("/", (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
});

server.post("/users", (req, res) => {
  const { username, password } = req.body;
  const userInfo = { username, passwordHash: password };
  const user = new User(userInfo);
  if (!username || !password) {
    return sendUserError("must include username and password", res);
  }

  user
    .save()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json(err));
});

server.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(validUser => {
          if (validUser) {
            req.session.name = user.username;
            res.status(200).json({ success: true });
          } else {
            res.status(401).json({ msg: "password is invalid" });
          }
        });
      } else {
        return sendUserError("please provide a valid username", res);
      }
    })
    .catch(err => res.status(500).json(err));
});

server.post("/logout", (req, res) => {
  req.session.login = false;
  res.status(200).json({ message: "User has successfully logged out." });
});

server.use((err, req, res, next) => {
  if (err) {
    res.status(500).json(sendUserError(err, res));
  }
});
 server.get('/restricted', (req, res) => {
   res.status(200).json({ message: 'You have accessed the restricted content.' })
 })


const restricted = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.login) {
      sendUserError("You are not authorized to access.", res);
      return;
    }
  }
  next();
};

server.use(restricted);

module.exports = { server };
