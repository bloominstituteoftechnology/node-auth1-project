const express = require('express');
const db = require('./data/dbConfig');
const mw = require('./middleware/middleware');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const server = express();
server.use(express.json());

const PORT = 4070;
const sessionConfig = {
  name: 'mySession',
  secret: 'This is not a secret!',
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 10
  },
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  }),
  httpOnly: true,
  resave: false,
  saveUninitialized: false
};

server.use(session(sessionConfig));

server.post('/api/register', (req, res) => {
  const user = req.body;
  if (!user.password || !user.username) {
    res.status(400).json({ error: 'Username and Password are required!' });
  }
  user.password = bcrypt.hashSync(user.password, 12);
  db('users')
    .insert(user)
    .then(ids => res.status(201).json(ids[0]))
    .catch(err => res.status(500).json(err));
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where('username', creds.username)
    .first()
    .then(user =>
      user && bcrypt.compareSync(creds.password, user.password)
        ? ((req.session.userId = user.id), res.json({ message: 'Logged in!' }))
        : res.status(401).json({ message: 'You shall not pass!' })
    )
    .catch(err => res.status(500).json(err));
});

server.get('/api/users', mw.protectRoute, (req, res) => {
  db('users')
    .then(users =>
      !users.length
        ? res.status(404).json({
            error: 'There is no users just yet, please try again later.'
          })
        : res.json(users)
    )
    .catch(err => res.status(500).json(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      err
        ? res.send("You won't leave easily!")
        : res.send('You logged out successfully!');
    });
  }
});

server.listen(PORT, () =>
  console.log(`Server is up and running in port: ${PORT}`)
);
