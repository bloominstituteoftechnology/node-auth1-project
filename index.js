// ---- DEPENDENCIES ----
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs');
const protect = require('./middleware/protectMiddleware');

const db = require('./data/dbConfig');

const server = express();

// ---- MIDDLEWARE CONFIG ---- (what is passed into middleware functions)
const sessionConfig = {
  name: 'authProject',
  secret: 'isThereAWayToGenerateUniqueSecrets?',
  cookie: {
    maxAge: 1000 * 60 * 10,
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
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

// ---- ENDPOINTS ----
// ---- REGISTER USER ----
server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 11);
  creds.password = hash;
  db('user_info')
    .insert(creds)
    .then((id) => {
      res.status(201).json(id);
    })
    .catch((err) => res.json(err));
});

// ---- LOGIN ----
server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('user_info')
    .where({ username: creds.username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.userId = user.id; // sets user id for session
        res.status(200).json({ message: 'welcome!' });
      } else {
        res.status(401).json({ message: 'wrong username or password' });
      }
    })
    .catch((err) => res.json(err));
});

// ---- LOGOUT ----
server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.send('could not log out');
      } else {
        res.send('see you later, dude!');
      }
    });
  } else {
    res.end();
  }
});

// ----GET ALL USERS ----
server.get('/api/users', protect, (req, res) => {
  db('user_info')
    .select('id', 'username', 'password')
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.send(err));
});

server.listen(3300, () => console.log('\n==SERVER RUNNING ON 3300==\n'));
