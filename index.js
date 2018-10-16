const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session'); // added this library

const knex = require('knex')
const knexConfig = require('./knexfile.js')
const db = knex(knexConfig.development)


const server = express();

const sessionConfig = {
  secret: 'yeet-gsdfgsdfgsdgsdfgdsfg.a%dwarf.!',
  name: 'david', // defaults to connect.sid
  httpOnly: true, // JS can't access this
  resave: false,
  saveUninitialized: false, // laws !
  cookie: {
    secure: false, // over httpS
    maxAge: 1000 * 60 * 1,
  },
};
server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});


function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
}

// implemented this
server.post('/api/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 10);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = user.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});





server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// protect this route, only authenticated users should see it
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});



server.listen(3300, () => console.log('\nrunning on port 3300\n'));