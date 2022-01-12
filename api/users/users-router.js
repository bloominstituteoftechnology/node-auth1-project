// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!

const router = require ('express').Router() // router is a function that returns an object
//const restricted = require('./auth-middleware.js') // will check if the user is logged in

const { restricted } = require('../auth/auth-middleware') // will check if the user is logged in

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */

  router.get('/', restricted, (req, res, next) => {
    //res.send('Welcome to the users API!') // only one res per route
    res.json('users')
  })


// Don't forget to add the router to the `exports` object so it can be required in other modules


module.exports = router;