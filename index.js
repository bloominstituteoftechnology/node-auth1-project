const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); //added package and required it here
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./data/dbConfig.js');

const server = express();

const sessionConfig = {
  name: 'dragon',
  secret: 'as;odfgjhasjrlfg;oasjn;sofanvg',
  cookie: {
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

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

//sanity check
server.get('/', (req, res) => {
  res.send("It's Alive!");
});

server.post('/api/register', (req, res) => {
  //grab username and password from the body
  const creds = req.body;
  //generate the hash from the user's password

  const hash = bcrypt.hashSync(creds.password, 14); //rounds is 2^X
  //override the user.password with the hash
  creds.password = hash;
  //save the user to the database
  db('users')
    .insert(creds)
    .then(ids => {
      console.log('test');
      res.status(201).json(ids);
    })
    .catch(err =>
      res.status(400).json({ message: 'Registration failed.', error: err })
    );
});

function protected(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ you: 'shall not pass!' });
  }
}

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        //passwords match and user exists by that username
        req.session.user = user.id;
        res.status(200).json({ message: 'Welcome!' });
      } else {
        //either username is invalid or password is wrong
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => res.json(err));
});

//protect this route, only authenticated users should see it
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password') //added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('You can never leave');
      } else {
        res.send('farewell');
      }
    });
  } else {
    res.end();
  }
});

const port = 8800;
server.listen(port, function() {
  console.log('\nrunning on port 8800\n');
});
