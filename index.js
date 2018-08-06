// import packages
const express = require("express");
const db = require("./data/db");
const server = express();
const bcrypt = require("bcryptjs");

// import routers

// use middleware
server.use(express.json());

// endpoints
server.get("/", (req, res) => {
  res.send("Up and running...");
});

let loggedIn = false;

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
        res.send("welcome");
      } else {
        return res.status(401).json({ error: "Incorrect credentials" });
      }
    })
    .catch(function(error) {
      res.status(500).json(error.message);
    });
});

// GET /api/users

// run server
const port = 8000;
server.listen(port, function() {
  console.log(`\n=== WEB API LISTENING ON HTTP://LOCALHOST:${port} ===\n`);
});
