const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const dbConfig = require('./knexfile');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = knex(dbConfig.development);
const server = express();

server.use(cors());
server.use(express.json());
server.use(
  session({
    name: 'notsession',
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: 'sessions',
      sidfieldname: 'sid',
      knex: db,
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
  })
);

server.get('/greet', (req, res) => {
  res.send(`hello ${req.session.username}`);
});

server.post('/api/register', (req, res) => {
  let cred = req.body;
  cred.password = bcrypt.hashSync(cred.password, 5);

  db.insert(cred).into('users')
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Invalid input' });
    })
});

server.post('/api/login', (req, res) => {
  let cred = req.body;

  db('users').where({ username: cred.username }).first()
    .then((user) => {
      if(user && bcrypt.compareSync(cred.password, user.password)) {
        req.session.username = cred.username;
        res.status(200).json({ message: 'Logged in' });
      } else {
        res.status(401).json({ message: 'YOU SHALL NOT PASS!' });
      }

    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    })
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});

server.get('/api/users', (req, res) => {
  if(req.session && req.session.username){
    db('users').select('id', 'username')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ message: 'Database not found' });
    })
  } else {
    res.status(401).json({ message: 'You are not authorized to view this resource' });
  }
});

server.listen(8000, () => {
  console.log('== LISTENING ON PORT 8L ==');
})
