const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile').development;
const knexSession = require('connect-session-knex');
const session = require('express-session');

const restricted = (req, res, next) => {
  if(req.session.username) {
    next();
  } else {
    res.status(200).json({message: "You are not logged in."});
  }
}

router.use(restricted);

router.get('/about', (req, res) => {
  res.status(200).sendFile('/Users/brianruff/Desktop/LambdaSchool/week13/auth-i/views/index.html');
})

module.exports = router;