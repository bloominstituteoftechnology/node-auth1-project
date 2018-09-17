/* eslint-disable */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false,
  name: 'auth-sprint',
  secure: false,
  // cookie: {maxAge: 1 * 24 * 60 * 8 * 1000}, //milisecs
  // store: new MongoStore({
  //   url: 'mongodb://localhost/sessions',
  //   ttl: 1 * 60, //seconds
  // })
}));

const restricter = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if(!req.session.name) {
      sendUserError({msg: 'Blocked Shot'}, res)
    }
  }
  next();
}
server.use(restricter);


const auth = function (req, res, next){
  if(req.session.name){
    User.findOne({username: req.session.name}).then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      sendUserError({err}, res)
    })

  }
  else{
    sendUserError({message: 'No Auth'}, res);
  }
}

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));


/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
}
  

// TODO: implement routes

server.post('/login', (req, res) => {
  const { username, password } = req.body;

  if(!username) {
    res.status(422).json({message:'Missing Username.'})
  }
  if(!password) {
    res.status(422).json({message:'Missing Password.'})
  }
  else{

  User.findOne({username}).then(user => {
      user.isPasswordValid(password).then(validPass => {
        if (validPass){
          req.session.name = user.username;
          res.status(200).json({ success: true })
        }
        else{
          sendUserError({message: 'Wrong Pass'}, res)
        }
      })
      
  })
  .catch(err => {
    sendUserError(err, res)
  })
}
  
})

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const passwordHash = password;
  const newUser = new User({ username, passwordHash });

  // if (!username || !password) { 
  //   res.status(422).json({message: 'User missing username or password.'})
  // }

  if (!username) {
    res.status(422).json({message:'Missing Username.'})
  }
  if (!password ) {
    res.status(422).json({message:'Missing Password.'})
  }
  else{
  newUser
    .save()
    .then((savedUser) => res.status(200).json(savedUser))
    .catch((err) => {sendUserError({err: 'Register failed'}, res)})
  }
})



server.post('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if(err) {
      sendUserError(err, res)
    }
    else{
      res.status(200).json({ msg: 'Get outta here!' });
    }
  })
})

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', auth, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
})

// server.get('/users', (req, res) => {
//   User.find()
//   .then(users => {
//     if (users) {
//       req.session.name = users[0].username;
//     }
//     res.json(users);
//   })
//   .catch(err => {
//     res.send('No users found.')
//   })
// })

server.get('/restricted/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      sendUserError("500", res);
      return;
    }
    res.json(users);
  })
});


// server.get('/test', (req, res) => {
//   res.json({ api: 'Its working' })
// })

module.exports = { server };
