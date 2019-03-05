const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./helpers/model.js');
const Users = require('./helpers/users-model')
const server = express();

const sessionConfig = {
  name: 'cookies',
  secret: 'the secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,

  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
}

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // check that passwords match
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user; // 4. this
        res
          .status(200)
          .json({ message: `Welcome ${user.username}!, have a cookie...` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(() => {
      res.status(500).send('Please make sure you have provided username and password');
    });
});
 
server.post('/api/register', (req, res) => {
  let user = req.body;

  // generate hash from user's password
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n

  // override user.password with hash
  user.password = hash;

  Users.add(user)
    .then(saved => {
      req.session.user = saved;
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
 
  function restricted(req, res, next) {
    if(req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'You shall not pass!' })
    }
  }

  server.get('/api/users', restricted, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send(
            'you can checkout any time you like, but you can never leave....'
          );
        } else {
          res.send('bye, thanks for playing');
        }
      });
    } else {
      res.end();
    }
  });

server.listen(5000, () => console.log('\nrunning on port 5000\n'));