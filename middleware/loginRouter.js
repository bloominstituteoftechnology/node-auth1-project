const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const router = express.Router();
const db = require('../data/dbConfig');

router.post('/', (req, res) => {
  // grab username and password from body
  const credentials = req.body;
  db('users')
    .where({
      username: credentials.username
    })
    .first() // returns the first match, works for unique usernames
    .then(user => {
      if(user && bcrypt.compareSync(credentials.password, user.password)) {
        //passwords match! and user exists by that username
       req.session.userId = user.id;
        res
          .status(200)
          .json({
            message: `Welcome, ${credentials.username}`
          })
      } else {
        // either username is invalid or password is wrong
        res
          .status(401)
          .json({
            message: "Sorry, I can't let you in!"
          })
      }
    })
})

module.exports = router;