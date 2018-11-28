const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/db.js');
const helmet = require('helmet');

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const server = express();

server.use(express.json());
server.use(helmet());

const sessionConfig = {
  name: 'cookie',
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 20,
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
  })
}
server.use(session(sessionConfig));

const protected = (req, res, next) => {
  console.log(req);
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'no' })
  }
}


server.get('/', (req, res) => {
  res.send({ message: 'I am alive' });
});

//Register 
server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;
  db('users').insert(creds).then(id => res.status(201).json(id)).catch(err => res.json(err))
})

//Login
server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users').where({ username: creds.username }).first().then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)){
      req.session.userId = user.id;
      res.status(200).json({ message: 'Login Successful' });
    } 
    else {
      res.status(401).json({ message: 'Incorrect Username or Password'})
    }
  }).catch(err => res.json(err))
})
//User List
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.json(err)); 
})

const port = 3300;
server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});