const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
// const knexSession = require('connect-session-knex')(session);

const server = express();
const db = require('./data/helpers/dbHelpers')

const PORT = 3500;

const sessionConfig = {
  name: 'user_session', 
  secret: 'the-undetermined-sailor',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
}

server.use(
  express.json(),
  // cors(),
  session(sessionConfig)
)

//registering a new user
server.post('/api/register', (req, res) => {
  const newUser = req.body;
  newUser.password = bcrypt.hashSync(newUser.password, 11);
  db.addUser(newUser)
    .then( userID => {
      res.status(201).json({id: userID[0]})
    })
    .catch( err => {
      res.status(500).json({errorMessage: "unable to create new user"})
    })
});

//authenticating a user when logging in
server.post('/api/login', (req, res) => {
  const userCreds = req.body;
  
  db.authorize(userCreds.username)
    .then(user => {
      if(user.length && bcrypt.compareSync(userCreds.password, user[0].password)) {
        req.session.userId = userCreds.username;
        res.json({message: "you are logged in. Welcome"});
      } else {
        res.status(404).json({errorMessage: "You shall not pass"});
      }
    })
    .catch( err => {
      res.status(500).json({errorMessage: "unable to process authorization"})
    })
});

//getting all users
server.get('/api/users', autho, (req, res) => {
  db.getUsers()
    .then(users => {
      res.json(users)
    }).catch( err => {
      res.status(500).json({errorMessage: "unable to get users"})
    })
})

server.post('/api/logout', (req, res) => {
  req.session.destroy( err => {
    if(err) {
      res.status(500).json({errorMessage: 'did not successfully lof out'})
    } else {
      res.json({message: 'properly logged out'})
    }
  })
})

function autho(req, res, next) {
  if(req.session && req.session.userId) {
    next();
  }else {
    res.status(401).json({errorMessage: 'you do not have access'})
  }
}

server.listen(PORT, () => {
  console.log(`<==== running server on port ${PORT} ===>`)
})