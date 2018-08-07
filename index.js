const express = require("express");
const db = require("./data/db.js");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const server = express();

function protected(req, res, next) {
  if (req.session && req.session.username === 'John123') {
    next();
  } else {
    return res.status(401).json({ error: 'Incorrect credentials' });
  }
}


server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: true,
  })
);

server.use(express.json());

server.get("/api/users", protected, (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  db("users")
    .insert(user)
    .then(ids => {
      db("users")
        .where({ id: ids[0] })
        .first()
        .then(user => {
          res.status(201).json(user);
        });
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      });
    });
});

server.post("/api/login", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.username = user.username
        res.send(`Welcome ${user.username}!`);
      } else {
        return res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
