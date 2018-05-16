const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);

const User = require("./user");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false, // option to use either http or https; false for http (development model)
    resave: true,
    saveUninitialized: false,
    name: "noNom", // default name is connect.sid;
    // default name gives away to potential hackers that we are using express-session.
    // one more reason to make your security vulnerable.
    store: new MongoStore({
      url: "mongodb://localhost/sessions",
      ttl: 60 * 10
    })
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

function authenticate(req, res, next) {
  if (req.session === req.session.username) {
    next();
  } else {
    res.status(401).send("Access denied.");
  }
}

// TODO: implement routes

server.get("/me", (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back commander ${req.session.username}`);
  } else {
    res.send("Who are you???");
  }
});

server.get("/users", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).send(err));
});

server.post("/register", function(req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(newUser => res.status(201).json(newUser))
    .catch(err => res.status(500).json(err));
});

server.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username;
            res.send("login was successful");
          } else {
            res.status(401).send("invalid credentials");
          }
        });
      } else {
        res.status(401).send("invalid username");
      }
    })
    .catch(err => res.send(err));
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
