// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!

const express    = require('express');
const model      = require('./users-model');
const middleware = require('../auth/auth-middleware');
const router = express.Router();

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
router.get('/', middleware.restricted, async (req, res) => {
  console.log('Here are all the users');
  try {
    const users = await model.find();
    res.status(200).send(users);
  } catch(err) {
    res.status(500).json({
      message: 'Error retrieving users'
    });
  }
});

module.exports = router; 