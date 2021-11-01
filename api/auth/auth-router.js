const express    = require('express');
const model      = require('../users/users-model');
const middleware = require('./auth-middleware');
const bcrypt = require('bcryptjs');
const router = express.Router();


// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }
  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }
  response on username taken:
  status 422
  {
    "message": "Username taken"
  }
  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }
  response:
  status 200
  {
    "message": "Welcome sue!"
  }
  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
/**
  3 [GET] /api/auth/logout
  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }
  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */


// Don't forget to add the router to the `exports` object so it can be required in other modules

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy(err => {
      if(err) {
        res.json(`Can't logout: ${err.message}`);
      } else {
        res.json('You were logged out');
      }
    })
  } else {
    res.json(`Session wasn't set`);
  }
});

router.post('/login', middleware.checkUsernameExists, (req, res, next) => {
  let {username, password} = req.body;

  model.findBy({username})
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
        req.session.user = req.userData;
        res.status(200).json({message: `Welcome ${user.username}`});

      } else {
        res.status(401).json({message: 'Invalid credentials'});
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/register', middleware.checkUsernameFree, middleware.checkPasswordLength, (req, res, next) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  model.add(credentials)
    .then(success => {
      res.status(200).json(success);
    })
    .catch(error => {
      res.status(500).json(`Server error ${error}`);
    })
});


module.exports = router; 