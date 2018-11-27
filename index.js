const express = require('express');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig');



const server = express();

const sessionConfig = {
  name: 'spock',
  secret: 'live long and prosper',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,

  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 10
  })
}

server.use(session(sessionConfig))
server.use(express.json());

      

server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)){
        req.session.user = user.id;
        res.status(200).json({message: 'Logged in'})
      } else {
        res.status(401).json({message: 'you shall not pass!'})
      }
    })
    .catch(error => res.json(error))
})

function protect(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
} 

server.get('/api/users', protect, (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(error => res.send(error))

})

server.get('/api/restricted/other', protect, (req, res) => {
  db('users')
    .select('id', 'username') 
    .where({ id: req.session.user })
    .first()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('/api/register', (req,res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(error => json(error))
})


server.get('/', (req, res) => {
  res.send('It\'s Alive!');
});

const port = 8000;
server.listen(port, () => console.log(`server is running on ${port}`))