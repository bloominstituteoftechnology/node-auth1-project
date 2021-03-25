// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const {restricted} = require('../auth/auth-middleware')

const router = require("express").Router();

const Users = require("./users-model.js");

router.get('/', restricted,  (req,res) => {
  Users.find()
    .then(users=> {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(401).json({message: 'You shall not pass!'})
    })
})

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
module.exports = router;