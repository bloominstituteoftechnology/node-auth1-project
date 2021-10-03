// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!

// const express = require('express')
const router = require('express').Router()
const {restricted} = require('../auth/auth-middleware')
const User = require('./users-model')
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

  router.get('/', restricted, async (req, res, next) => { // counting on there being an error handling middleware
    //res.json('users')
    try {
      const users = await User.find()
      res.json(users) //status code default: 200
    } catch (error) {
      next(error)
    }
  })

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router