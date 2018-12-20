const express = require("express");

const configureMiddleware = require("./config/middleware");
const db = require("./data/dbConfig");
const bcyrpt = require("bcryptjs");

// Create server
const server = express();
const PORT = 3333;

// Middleware
configureMiddleware(server);

server.get("/", (req, res) => {
  res.send("🔑 🔑 🔑");
});

// Creates a user using the information sent inside the body of the request. Hash the password
// before saving the user to the database.
server.post("/api/register", (req, res) => {});

// Use the credentials sent inside the body to authenticate the user. On successful login,
// create a new session for the user and send back a 'Logged in' message and a cookie that
// contains the user id. If login fails, respond with the correct status code and the message:
// 'You shall not pass!'
server.post("/api/login", (req, res) => {});

// If the user is logged in, respond with an array of all the users contained in the database.
// If the user is not logged in repond with the correct status code and the message:
// 'You shall not pass!'.
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.send(err);
    });
});

// Start listening
server.listen(PORT, () => {
  console.log(`\n=== API Listening on http://localhost:${PORT} ===\n`);
});
