const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// implemented this
server.post('/register', (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 10);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

const jwtSecret = 'nobody tosses a dwarf!';

function generateToken(user) {
  const jwtPayload = {
    ...user,
    hello: 'FSW13',
    roles: ['admin', 'root'],
  };
  const jwtOptions = {
    expiresIn: '1h',
  };

  return jwt.sign(jwtPayload, jwtSecret, jwtOptions);
}

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user); // new line
        res.status(200).json({ welcome: user.username, token });
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// protect this route, only authenticated users should see it
server.get('/users', protected, checkRole('admin'), (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json({ users });
    })
    .catch(err => res.send(err));
});

function protected(req, res, next) {
  // authentication tokens are normally sent as a header instead of the body
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        // token verification failed
        res.status(401).json({ message: 'invalid token' });
      } else {
        // token is valid
        req.decodedToken = decodedToken; // any sub-sequent middleware of route handler have access to this
        console.log('\n** decoded token information **\n', req.decodedToken);
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'no token provided' });
  }
}

function checkRole(role) {
  return function(req, res, next) {
    if (req.decodedToken && req.decodedToken.roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: 'you shall not pass! forbidden' });
    }
  };
}



const port = 5000;
server.listen(port, function() {
  console.log(`\n=== API listening on port ${port} ===\n`);
});