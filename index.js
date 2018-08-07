const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./data/db');
const server = express();
const sessionOptions = {
  secret: 'arrrrrr',
  cookie: {
    maxAge: 1000 * 60 * 60 
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
}
server.use(session(sessionOptions));
server.use(express.json());

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({
      message: 'You are not authorized'
    })
  }
}

server.get('/api/users', protected, (req, res) => {
  db('User')
    .then(users => res.json(users))
    .catch(err => res.json(err));
})

server.get('/', (req, res) => {
  console.log(req.session.username)
  if (req.session && req.session.username) {
    res.status(200).json({ message: ` welcome back ${req.session.username}` })
  } else {
    res.status(401).json({message: ''})
  }
})

server.post('/api/register', (req, res) => {
  // save the user to the database
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  db    
    .insert(user)
    .into('User')
    .then(id => {
      db('User')
        .then(user => res.status(201).json(user.pop()))
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  db
    ('User')
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({ error: 'Incorrect credentials' });
      } else {
        req.session.username = credentials.username;
        return res.send('You are logged in')
      }
    })  
    .catch(err => {
      res.status(500).json({ error });
    });
})

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json(`Unable to log out`);
      } else {
        res.status(200).json(`You are logged out`)
      }
    });
  }
})

server.listen(8000, () => {
  console.log('API running on port 8000')
});

