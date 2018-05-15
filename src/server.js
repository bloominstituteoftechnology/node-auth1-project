const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const User = require("./user");

mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => console.log("\n... API Connected to Database ...\n"))
  .catch(err => console.log("\n*** ERROR Connecting to Database ***\n", err));

const server = express();

function authenticate(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).send("You shall not pass!!!");
  }
}

const sessionConfig = {
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: "noname",
  store: new MongoStore({
    url: "mongodb://localhost/sessions",
    ttl: 60 * 10
  })
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

server.get("/", (req, res) => {
  res.send({ route: "/", message: req.message });
});

server.post("/register", function(req, res) {
  const user = new User(req.body);
  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.comparePassword(password).then(isMatch => {
          if (isMatch) {
            req.session.username = user.username;
            res.send("login successful");
          } else {
            res.status(401).send("invalid credentials");
          }
        });
      } else
        res
          .status(404)
          .send(`There is no user with the username ${req.body.username}.`);
    })
    .catch(err => res.send("LOGIN ERROR"));
});

server.get("/users", authenticate, (req, res) => {
  User.find().then(users => res.send(users));
});

server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.send("LOGOUT ERROR");
      } else {
        res.send("Thou art rightly logged out my dude");
      }
    });
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});
