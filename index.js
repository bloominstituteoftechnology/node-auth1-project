const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session)


const knex = require('knex');
const knexConfig = require('./knexfile.js');
// const db = require('./database/dbConfig.js');
const db = knex(knexConfig.development)

const server = express();

const sessionConfig = {
  secret: 'this.is%my.secret%key',
  name: 'chad',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000*60*25,
  },
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000*60*10
  })
}

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());

server.get('/users', protected,  (req, res) => {
  db('users')
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.error(err.message)
      res.status(500).json(err)
    })
})

server.post('/register', (req, res) => {
  creds = req.body

  const hash = bcrypt.hashSync(creds.password, 12)
  creds.password = hash

  db('users')
    .insert(creds)
    .then(user => {
      req.session.username = creds.username
      res.status(201).json(user)
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).json(err)
    })
})

server.post('/login', (req, res) => {
  creds = req.body

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = creds.username
        res.status(200).json({ welcome: user.username })
      } else {
        res.status(401).json({ message: 'You shall not pass!'})
      }
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).json(err)
    })
})

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("But you can never leave, tu du-ru-run")
      } else {
        res.send('Bubis-bye')
      }
    });
  }
});

function protected(req, res, next) {
  if (req.session && req.session.username){
    next();
  } else {
    res.status(401).send('You shall remain unauthorized')
  }
}

const port = 9000;

server.listen(port, function() {
  console.log(`\n Listening on Port:${port}\n`);
})
