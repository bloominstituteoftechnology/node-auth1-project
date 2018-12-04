const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db/dbConfig.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const sessionConfig = {
  name: 'cookie',
  secret: 'lkjhalaksjdhfalksdjhfalksjdhf',
  cookie : {
    maxAge: 1000 * 60 * 10,
    secure: false
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
};

const server = express();
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

function protected(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ you: 'shall not pass!!' });
  }
}

server.get('/', (req, res) => {
  res.send('Server Running!');
});

server.get('/api/users', protected, (req, res) => {
  db('users')
  .select('id', 'username', 'password')
  .then(users => {
    res.json(users)
  })
  .catch(err => res.json(err));
})

server.get('/api/currentuser', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .where({ id: req.session.userId })
    .first()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
})

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.json(err));
})

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: 'Username or Password is incorrect!'});
      }
    })
    .catch(err => res.json(err));
})

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('Unable to Logout');
      } else {
        res.send('Thank you for visiting');
      }
    })
  }
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db('users')
  .where({ id: id })
  .del()
  .then(count => {
    res.status(200).json({ count });
  })
  .catch(err => res.status(500).json(err));
})


server.listen(8000, () => console.log('\nrunning on port 8000\n'));