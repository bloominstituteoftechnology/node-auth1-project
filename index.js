const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();


//session cookie
const sessionConfig = {
  name: 'the cookie cookie',
  secret: 'moveittoanenv',
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
server.use(express.json());
server.use(helmet());
server.use(cors());



//middleware for restricting routes to logged-in users
const protected = (req, res, next) => {
  console.log(req);
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'go away' })
  }
}

const checkUser = (req, res, next) => {
  if (req.path.includes('/restricted/')) {
      protected(req, res, next);
  } else {
    next(); 
  }
}

//sanity check
server.get('/', (req, res) => {
  res.send({ message: 'it is alive' });
});

//register new users
server.post('/api/register', (req, res) => {
  const creds = req.body;
  db('users').where({ username: creds.username }).first().then(user => {
    if (user) {
      res.status(422).json({ message: 'A user with that username already exists' })
    } else {
      const hash = bcrypt.hashSync(creds.password, 14);
      creds.password = hash;
      db('users').insert(creds).then(id => {
        req.session.userId = id;
        res.status(201).json(id)
      }).catch(err => res.json(err));
    }
  }).catch(err => res.json(err));
})

//login existing users
server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users').where({ username: creds.username }).first().then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)){
      //passwords match and correct username
      req.session.userId = user.id;
      res.status(200).json({ message: 'welcome to the thunderdome!' });
    } else {
      //messed up
      res.status(401).json({ message: 'you shall not pass'})
    }
  }).catch(err => res.json(err))
})

//list of users if logged in
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.json(err));
})

//logout
server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('play with us');
      } else {
        res.send('bye bye');
      }
    })
  } else {
    res.end();
  }
})

server.get('/api/restricted/something', checkUser, (req, res) => {
  res.status(200).json({ message: 'one of us!'})
})
server.listen(9000, () => {
  console.log('\nrunning on port 9000\n');
})
