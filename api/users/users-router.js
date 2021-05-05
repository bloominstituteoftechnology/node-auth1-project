// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()

const db = require("./users-model")
const mw = require("../auth/auth-middleware")

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

  router.get("/api/users", mw.restricted(), async (req, res, next) => {
    try {
      res.json(await db.find())
    } catch(err) {
      next(err)
    }
  })
  


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router