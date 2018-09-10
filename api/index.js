const router = require('express').Router();
const db = require('knex')(require('../knexfile').development);

router.post('/register', (req, res) => {
  // create user w/ req.body, but w/ a hashed password
});

router.post('/login', (req, res) => {
  // authenticate user ? 'Logged in' : 'You shall not pass!'
});

router.get('/users', (req, res) => {
  // logged in ? users arr : 'You shall not pass!'
});

module.exports = router;
