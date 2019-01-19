const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./dbHelpers");
const session = require("express-session");

const server = express();
const PORT = 4045;

server.use(express.json());

server.use(
  session({
    name: "notsession", // default is connect.sid
    secret: "nobody tosses a dwarf!",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
      // secure: true, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false
  })
);

server.get("/", (req, res) => {
  res.send("Yep, this is the server!");
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 14);
  if (user.username && user.password) {
    db.insertUser(user)
      .then(id => {
        res.status(201).json({ message: `User created with the id of ${id}` });
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json({ message: "Please enter a username and password" });
  }
});

server.post("/api/login", (req, res) => {
  const user = req.body;
  db.findByUsername(user.username)
    .then(dbUser => {
      if (dbUser[0] && bcrypt.compareSync(user.password, dbUser[0].password)) {
        req.session.userId = dbUser[0].id;
        res.json({ message: "You have successfully logged in" });
      } else {
        res.status(400).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/api/users", (req, res) => {
  if (req.session && req.session.userId) {
    db.findUsers()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).json({ message: "Unable to fetch users" });
      });
  } else {
    res.status(400).json({ message: "You shall not pass!" });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
