const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const db = require("./data/dbConfig.js");

const server = express();

// configure express-session middleware
server.use(
  session({
    name: "zipedeedodah", // default is connect.sid
    secret: "nobody tosses a dwarf!",
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
    resave: false,
    saveUninitialized: false
  })
);

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("This is working...");
});

server.post("/api/register", (req, res) => {
  //grab credentials
  const creds = req.body;

  // hash the password
  const hash = bcrypt.hashSync(creds.password, 10);

  //replace the user password with the hash
  creds.password = hash;

  //save the user
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];

      //return 201 status
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  // grab creds
  const creds = req.body;

  // find the user
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      //check creds
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res
          .status(200)
          .send(`Welcome to your account, ${req.session.username}`);
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => res.status(500).send(err));
});

// protect this route, only authenticated users should see it
server.get("/api/users", (req, res) => {
  if (req.session && req.session.username) {
    db("users")
      .select("id", "username")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
});

server.listen(4000, () => console.log("\nrunning on port 4000\n"));
