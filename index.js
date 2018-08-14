const express = require('express');
const db = require('./data/db');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const server = express();

function protected(req, res, next) {
  if (req.session && req.session.username === 'sumi') {
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
      secure: false // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: true
  })
);

server.use(express.json());

server.post('/register', (req, res) => {
  const user = req.body;
  //hash password inside of post route
  // and then store user in database
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  db('users')
    .insert(user)
    .then(function(ids) {
      db('users')
        .where({ id: ids[0] })
        .first()
        .then((user) => {
          res.status(201).json(user);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// server.post('/login', (req, res) => {
//   const credentials = req.body;

//   db('users')
//     .where({ username: credentials.username })
//     .first()
//     .then(function(user) {
//       const passwordMatch = bcrypt.compareSync(credentials.password, user.password);
//       if (!user || !passwordMatch) {
//         return res.status(404).json({ error: 'Incorrect credentials' });
//       }

//       db('users')
//         .where({ id: ids[0] })
//         .first()
//         .then((user) => {
//           res.status(201).json(user.username);
//         });
//     })
//     .catch((err) => {
//       res.status(500).json(err);
//     });
// });

server.post('/login', (req, res) => {
  const credentials = req.body;

  db('users')
    .where({ username: credentials.username })
    .first()
    .then(function(user) {
      if (user || bcrypt.compareSync(credentials.password, user.password)) {
        res.send('welcome');
      } else {
        return res.status(401).json({ error: 'Incorrect credentials' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

server.get('/users', protected, (req, res) => {
  db('users')
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.send(err));
});

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res.send('error logging out');
      } else {
        res.send('you have logged out');
      }
    });
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`server on http://localhost:${port}`);
});
