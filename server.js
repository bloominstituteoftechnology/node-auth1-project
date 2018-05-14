const express = require("express"); // remember to install your npm packages
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./src/user.js");
const bcrypt = require("bcrypt");
const session = require("express-session");

const server = express();

// const authenticate = (req, res, next) => {
//   if (req.body.password === "mellon") next();
//   else res.status(401).send("Wrong password");
// };

//use sessions for tracking logins
server.use(
  session({
    secret: "My super secret",
    resave: true,
    saveUninitialized: false
  })
);

server.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost/authdb")
  .then(() => {
    console.log("connected to database");
  })
  .catch(error => {
    console.error("database connection failed");
  });

server.get("/", (req, res, next) => {
  res.send("API running");
});

server.post("/register", (req, res, next) => {
  const user = new User(req.body);

  if (user.username && user.password)
    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  else res.status(400).json({ error: "Fields can't be empty" });
});

server.post("/login", (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, function(
    error,
    user
  ) {
    if (error || !user) {
      res.status(401).json({ error: "You shall not pass" });
    } else {
      req.session.userId = user._id;
      res.status(200).json("Logged in successfully!");
    }
  });
});

server.get("/users", (req, res, next) => {
  if (req.session.userId) {
    User.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ error: "You shall not pass" });
  }
});

// GET /logout
server.get("/logout", (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(err => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({ message: "Logged out" });
      }
    });
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});
