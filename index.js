const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const jwt = require('jsonwebtoken');
const db = require('./database/dbConfig.js');
const server = express();
const port = 9000;

const sessionConfig = {
  secret: 'nobody-tosses.a%dwarf.!',
  name: 'monkey',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 3,
  },
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());


// ======== SERVER RUNNING ======== //
server.get('/', (req, res) => {
  res.send('<h1>Its Alive!<h1>');
});


// ========= CREATES USER ========= //
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


// ======= GENERATES TOKEN ======= //
const jwtSecret = 'nobody tosses a dwarf!';

function generateToken(user) {
  const jwtPayload = {
    ...user,
    hello: 'FSW13',
    role: 'admin'
  };
  const jwtOptions = {
    expiresIn: '5m',
  };
  return jwt.sign(jwtPayload, jwtSecret, jwtOptions);
}


// ========== LOGIN ========= //
server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ welcome: user.username, token });
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});


// AUTHENTICATED USERS SHOULD GET USER-LIST //
server.get('/users', protected, (req, res) => {
  console.log('\n*** DECODED TOKEN INFO ***\n', req.decodedToken);
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json({ users });
    })
    .catch(err => res.send(err));
});


// === VERIFICATION for PROTECTION === //
function protected(req, res, next) {
  const token = req.headers.authorization;
  if(token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if(err) {
        // token verifcation failed
        res.status(401).json({ message: 'invalid token'});
      } else {
        // token is valid
        req.decodedToken = decodedToken;
        next();
      }
    })
  } else {
    res.status(401).json({ message: 'no token provided' })
  }
}


// ========= SERVER ========= //
server.listen(port, function() {
    console.log(`\n API RUNNING ON PORT ${port} \n`);
  });
