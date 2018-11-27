// imports
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const logger = require('morgan');
const db = require('./database/config.js');
// added relevant packages for sessions
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const restricted = require('./restricted');


// session config
const sessionConfig = {
  name: 'giraffe',
  secret: 'asfjaofuwruq04r3oj;ljg049fjq30j4jlajg40j40tjojasl;kjg',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, // only set it over https; in production you want this true.
  },
  httpOnly: true, // no js can touch this cookie
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

// server + middleware
const server = express();
server.use(session(sessionConfig)); // wires up session management
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(logger('dev'));

// API status
server.get('/', (req, res) => res.send({API: "live"}))

server.get('/api/restricted/*', restricted, (req, res) => {
  res.send({message:"Welcome to the VIP section"})
})

// user registration endpoint
server.post('/api/register', (req, res) => {
    const creds = req.body; // grab username and pw from body
    const hash = bcrypt.hashSync(creds.password, 14); // generate hash from user's pw
    creds.password = hash;

    db('users').insert(creds).then(ids => {
      res.status(201).json(ids);
    }).catch(err => res.send(err));
})

// user login endpoint
server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users').where({username: creds.username}).first().then(user => {
      // user exists and pws match
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.user = user.id;
        res.status(200).json({message: "Logged In"});
      } else {
        res.status(401).json({message: "You shall not pass!"});
      }
    }).catch(err => res.send(err));
})

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  if (req.session && req.session.user) {
    // they're logged in, go ahead and provide access
      db('users')
      .select('id', 'username') 
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  } else {
    // bounce them
    res.status(401).json({ message: 'you shall not pass!' });
  }
});

// server listening on dynamic port
const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`Server listening on ${port}`));