const express = require("express"); // remember to install your npm packages
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./src/user.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

const server = express();
server.use(cors(corsOptions));

const restrictAccess = (req, res, next) => {
  if (req.path.startsWith("/api/restricted")) {
    if (req.session && req.session.userId) next();
    else
      res
        .status(422)
        .json({ message: "This content is restricted to logged in users" });
  } else {
    next();
  }
};
//use sessions for tracking logins
server.use(
  session({
    secret: "My super secret",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
    name: "DontPWNmeh",
    store: new MongoStore({
      url: "mongodb://localhost/sessions",
      ttl: 60 * 10
    })
  })
);

server.use(bodyParser.json());
server.use(restrictAccess);

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

server.post("/api/register", (req, res, next) => {
  const user = new User(req.body);

  if (user.username && user.password)
    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  else res.status(400).json({ error: "Fields can't be empty" });
});

server.post("/api/login", (req, res, next) => {
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

server.get("/api/users", (req, res, next) => {
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

server.get(`/api/restricted/:name`, (req, res, next) => {
  const name = req.params.name;
  res.status(200).json({
    message: `Welcome to special ${name} page restricted to VIP users`
  });
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
