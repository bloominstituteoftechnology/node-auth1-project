const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./dbHelpers');
const restrictedRoutes = require('./restrictedRoutes');

const server = express();

// Custom Middleware
const protect = (req, res, next) => {
  if (req.session && req.session._id) {
    next();
  } else {
    res.status(400).send('Access denied');
  }
};

const restrict = (req, res, next) => {
  if (req.session && req.session._id) {
    next();
  } else {
    res.status(400).send('YOU SHALL NOT PASS!');
  }
};

server.use(express.json());
server.use(cors());
server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
      // secure: true, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false
  })
);

server.get('/', (req, res) => {
  res.send('Live server!');
});

server.use('/api/restricted', restrict, restrictedRoutes);

server.post('/api/register', (req, res) => {
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
    res.status(400).json({ message: 'Please enter a username and password' });
  }
});

server.post('/api/login', (req, res) => {
  const user = req.body;
  db.findByUsername(user.username)
    .then(dbUser => {
      if (dbUser[0] && bcrypt.compareSync(user.password, dbUser[0].password)) {
        req.session._id = dbUser[0].id;
        res.json({ message: 'You have successfully logged in' });
      } else {
        res.status(404).json({ message: 'Invalid username or password' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    err ? res.send('failed to log out') : res.send('Logged out successfully.');
  });
});

server.get('/api/users', protect, (req, res) => {
  db.getUsers()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

const PORT = 4040;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
