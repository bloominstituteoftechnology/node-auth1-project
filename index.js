const express = require("express");
const session = require("express-session");

const configureMiddleware = require("./config/middleware");
const db = require("./data/dbConfig");
const bcyrpt = require("bcryptjs");

// Create server
const server = express();
const PORT = 3333;

// Middleware
configureMiddleware(server);

server.use(
    session({
        name: 'authentication-session',
        secret: 'is anyone out there?',
        cookie: {
            maxAge: 1 * 24 * 60 * 6 * 1000,
            secure: true
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false
    })
)

server.get("/", (req, res) => {
  res.send("🔑 🔑 🔑");
});

// Creates a user using the information sent inside the body of the request. Hash the password
// before saving the user to the database.
server.post("/api/register", (req, res) => {
  // Save login credentials from body
  const credentials = req.body;

  // Hash password
  const hash = bcyrpt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Use the credentials sent inside the body to authenticate the user. On successful login,
// create a new session for the user and send back a 'Logged in' message and a cookie that
// contains the user id. If login fails, respond with the correct status code and the message:
// 'You shall not pass!'
server.post("/api/login", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcyrpt.compareSync(credentials.password, user.password)) {
        res.status(200).json({ message: "Logged in" });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

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
