const express = require('express');
const db = require('../data/dbConfig.js');
const router = express.Router();

router.post('/register', (req, res) => {
  res.status(200).json('register');
});

router.post('/login', (req, res) => {
  res.status(200).json('login');
});

router.get('/users', (req, res) => {
  res.status(200).json('users');
});

module.exports = router;