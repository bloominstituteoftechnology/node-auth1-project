const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// server requirements
const server = express();
const db = require('./data/dbHelpers.js');
const PORT = 3636;

// configure express-session middleware
server.use(
  session({
    name: 'mysession',
    secret: 'this is my lil secret yo',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

server.use(express.json());

// protect mw
const protect = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(400).send('access denied')
  }
}
// endpoints

// REGISTER POST:
server.post('/api/register', (req, res) => {
  const newUser = req.body;
  if (newUser.name && newUser.password) {
    newUser.password = bcrypt.hashSync(newUser.password, 12);
    db.insert(newUser)
      .then(newId => {
        res.status(201).json(newId);
      })
      .catch(err => {
        res.status(500).json({ error: "Could not register a new user." });
      })
  } else {
    res.status(400).json({ error: "Please provide a name and a password." })
  }
});

// LOG IN POST:
server.post('/api/login', (req, res) => {
  const creds = req.body;
  db.findByUsername(creds.name)
    .then(user => {
      if (user.length && bcrypt.compareSync(creds.password, user[0].password)) {
        req.session.userId = user[0].id;
        res.json({ info: "You have succesfully logged in" });
      } else {
        res.status(201).json({ error: "Wrong username or password" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to log in' });
    });
});

// GET:
server.get('/api/users', protect, (req, res) => {
  db.findUsers()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// LOG OUT POST:
server.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send('failed to log out')
    } else {
      res.send('You have logged out successfully')
    }
  })
})

server.listen(PORT, () => {
  console.log(`\n=== Web API listening on http://localhost:${PORT} ===\n`);
});