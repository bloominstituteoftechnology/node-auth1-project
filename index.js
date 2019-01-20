const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./dbConfig.js');

const server = express();

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

PORT = 7700;

server.get('/', (req, res) => {
    res.send(`Running on ${PORT}`)
})

//POST REGISTER REQUEST
server.post('/api/register', (req, res) => {
  const user = req.body;
  console.log('session', req.session);
  //HASHING PASSWORD
  user.password = bcrypt.hashSync(user.password, 12);
    db('users').insert(user)
      .then(ids => {
        res.status(201).json({ id: ids[0] });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
server.post('/api/login', (req, res) => {
    // CHECK THAT USERNAME EXISTS AND THAT PASSWORDS MATCH
    const creds = req.body;
    db('users').where('username', creds.username)
      .then(users => {
        // USERNAME VALID (1ST CHECK)
        // PASSWORD FROM CLIENT = PASSWORD FROM DATABASE (2ND CHECK)
        // COMPARESYNC COMPARES HASH PASS AND USER PASS
        if (users.length && bcrypt.compareSync(creds.password, users[0].password)) {
          req.session.userId = users[0].id;
          res.json({ info: "Logged in" })
        } else {
          res.status(404).json({ err: 'You shall not pass!' })
        }
      })
      .catch(err => {
        res.status(500).send(err);
      })
  });
  
  // PROTECTED ROUTE, ONLY VISIBLE TO AUTHENTICATED USERS
server.get('/api/users', (req, res) => {
  console.log('session', req.session);
  if (req.session && req.session.userId) {
    db('users')
      .then(users => {
      res.json(users)
    })
  } else {
    res.status(400).send('You shall not pass!');
  }
  });


server.get('api/messages', (req, res) => {
  // CHECK FOR SESSION AND USER ID
  db.findMessagesByUser(req.session.userID)
})

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
