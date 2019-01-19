const express = require('express');
const server = express()
const cors = require('cors')
const db = require('./database/dbHelpers.js')
const bcrypt = require('bcryptjs');
const session = require('express-session');
server.use(express.json());
server.use(cors());
server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
}));

function protect(req, res, next) {
  if (req.session && req.session.userID) {
    next();
  } else {
    res.status(400).send('access denied')
  }
}
// basic get request to test if server is up 

server.get('/', (req, res) => {
  res.send("It's alive");
});

//this route should be protected, only authenticated users should be able to see it
server.get('/api/users', protect, (req, res) => {
  db.getUsers()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err))});

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 16) // 16 denotes how many times its hashes
  db.insertUser(user)
    .then(id => {
      res.status(201).json({ id: id[0] })
    })
    .catch(err => {
      res.status(500).json({ error: 'Please Try Again' })
    });
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db.findByUsername(creds.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(creds.password, users[0].password)) {
        req.session.userId = users[0].id
        res.json({ info: 'Success' })
      } else {
        res.status(404).json({ err: 'invalid password or username' })
      }
    })
    .catch(err => {
      res.status(404).json(err)
    });
});

server.post('api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send('not logged out');
    } else {
      res.send('logout successful');
    };
  });
});


server.listen(3300, () => console.log('\nrunning on port 3300\n'));