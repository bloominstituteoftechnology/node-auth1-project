// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const express = require("express");
const router = express.Router();
const User = require("./users-model");

router.get("/", router, (req, res) => {
  User.find()
  .then(users => {
    res.status(200).json(users)
  })
})

router.use((err, res) => { 
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    customMessage: 'Something went wrong inside the users router'
  });
});

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
module.exports = router