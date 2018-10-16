const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
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


// ======== PROTECTS USERS ======== //
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ Message: '<h1>Not authorized</h1>' });
  }
}


// ======== SERVER RUNNING ======== //
server.get('/', (req, res) => {
  res.send('<h1>Its Alive!<h1>');
});


// ========== CREATE USER ========== //
server.post('/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 12);
  credentials.password = hash;
  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = user.username;
      res.status(201).json({ newUserId: id});
  })
    .catch(err => {
    res.status(500).json(err);
  });
});


// ========== LOGIN ========== //
server.post('/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ Welcome: user.username})
      } else {
        res.status(401).json({ Message: 'YOU SHALL NOT PASS!'})
    }
  })
  .catch(err => {
    res.status(500).json({ err });
  });
});


// === AUTHENTICATED USERS GET USER-LIST === //
server.get('/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json({ userId: req.session.userId, users });
    })
    .catch(err => res.send(err));
});


// ========== LOGOUT ========== //
server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("You can't leave");
      } else {
        res.send("Goodbye");
      }
    })
  }
})


// ========= SERVER ========= //
server.listen(port, function() {
    console.log(`\n API RUNNING ON PORT ${port} \n`);
  });
