//[x] Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const authRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const users = require('../users.users-model.js');
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware') ///all being used for register?

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
    "message": "Username taken"                     //This validation all happens in the middleware
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
  authRouter.post('/api/auth/register', checkUsernameFree, checkUsernameExists, checkPasswordLength, (req, res) => {
    let user= req.body;
    const hash = bcrypt.hashSync(user.password)

    users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      })

  });




/**
  2[x] [POST] /api/auth/login { "username": "sue", "password": "1234" }

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
  authRouter.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    users.findBy({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });


/**
  3 [x][GET] /api/auth/logout

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
  authRouter.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(200).json({message:'no session'});
        } else {
          res.status(200).json({message:'logged out'});
        }
      })
    } else{
      res.status(200).json({message: "no session"})
    }
  });

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = authRouter;


