// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!

 const express = require('express')
const { route } = require('../server')
 const router = express.Router()
 const Users = require('./users-model')

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


// Don't forget to add the router to the `exports` object so it can be required in other modules

// Promise function
// router.get('/', (req, res, next) => {
//   Users.find()
//   .then(users => {
//     res.json(users)
//   })
//   .catch(err => console.log(err))
// })

// same thing async/await
router.get('/', async(req, res, next) => {

    try {
      const users = await Users.find()
    res.json(users)
    } catch (error) {
      console.log(error)
    }
})

module.exports = router;