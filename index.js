const express = require("express");
const db = require("./data/db");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const server = express();

// configure express-session middleware
server.use(
  session({
    name: "notsession", // default is connect.sid
    secret: "nobody tosses a dwarf!",
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    secure: true, // only set cookies over https. Server will not send back a cookie over http.
    resave: false,
    saveUninitialized: false
  })
);

server.use(express.json());

server.get("/", (req, res) => {
  res.send("up and running...");
});

//* GET authentications

server.get("/register", (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
});

//* POST register

server.post("/register", (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 14);

  user.password = hash;

  db("users")
    .insert(user)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ id, ...user });
    })
    .catch(err => res.status(500).json(err));
});

//* Authenticate user

server.post("/login", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        res.send(`Welcome ${user.username}`);
      } else {
        return res.status(401).json({ error: "Incorrect credentials" });
      }
    })
    .catch(err => res.status(500).json(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
