const cors = require('cors');
const express = require('express');
const knex = require('knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');

const db = knex(knexConfig.development);

const app = express();

const sessionConfig = {
  name: 'spanky',
  secret: 'skfalsdkhaighgkrjeahgkh',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({  
    tablename: 'sessions',
    sidfieldname: 'sessionId',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

app.use(session(sessionConfig));
app.use(express.json());
app.use(cors());

function protected(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!' });
  }
}

app.post('/api/register', (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;

  db('users').insert(creds).then(ids => {
    res.status(201).json(ids);
  }).catch(err => json(err));
});


app.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)){
        req.session.userId = user.id;
        res.status(200).json({ message: 'Thanks for loggging in.' })
      }else{
        res.status(401).json({ message: 'Login Credentials Incorrect' })
      }
  }).catch(err => json(err));
});


app.get('/', (req, res) => {
  res.send('Server Is Alive, Register at /api/register');
});

app.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

app.get('/api/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('you can never leave');
      }else{
        res.send('Adios');
      }
    })
  }else{
    res.end();
  }
});


module.exports = app;   