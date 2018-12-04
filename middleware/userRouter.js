const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../data/dbConfig');
const session = require('express-session');

router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => 
      res
        .json({
          errorMessag: "Sorry, we're having trouble getting the list of users..."
        }))
} else {
  res
    .status(401)
    .json({
      message: "Only registered users may view the user list!"
    })
}

})

module.exports = router;