// import packages
const express = require("express");
const db = require("./data/db");
const server = express();
const bcrypt = require("bcryptjs");
const session = require("express-session");

// import routers

// use middleware
server.use(express.json());

// configure express session middleware
// server.use(
//   session({
//     name: "notsession",
//     secret: "nobody tosses a dwarf",
//     cookie: {
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//       secure: false
//     },
//     httpOnly: true,
//     resave: false,
//     saveUninitialized: true
//   })
// );

// endpoints
server.get("/", (req, res) => {
  res.send("Up and running...");
});

// in class session example
server.get("/setname", (req, res) => {
  req.session.name = "frodo";
  res.send("got it");
});

server.get("/getname", (req, res) => {
  const name = req.session.name;
  res.send(`hello ${req.session.name}`);
});

// POST /api/register
server.post("/api/register", (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  db("users")
    .insert(credentials)
    .into("users")
    .then(res.status(200).json("USER CREATED SUCCESSFULLY"))
    .catch(error => res.status(500).json(error.message));
});

// POST /api/login
server.post("/api/login", function(req, res) {
  const credentials = req.body;

  db("users")
    .where({ user_name: credentials.user_name })
    .first()
    .then(function(user) {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.user_name = user.user_name;
        res.send(`welcome ${user.user_name}`);
      } else {
        return res.status(401).json({ error: "Incorrect credentials" });
      }
    })
    .catch(function(error) {
      res.status(500).json(error.message);
    });
});

// GET /api/users
server.get("/api/users", (req, res) => {
  if (req.session && req.session.user_name === "Lord Nikon") {
    db("users")
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => res.status(500).json(error.message));
  } else {
    res.status(401).json("You shall not pass!");
  }
});

// run server
const port = 8000;
server.listen(port, function() {
  console.log(`\n=== WEB API LISTENING ON HTTP://LOCALHOST:${port} ===\n`);
});
