const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../models/User-model');

//@ROUTE            POST /api/register
//@DESC             creates a new user
//@ACCESS           Public
router.post('/register', async (req, res) => {
  const { body } = req;
  const { username, password } = body;

  // if username or password isn't in req body, reject
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password required' });
  }

  // hashes password
  const hash = bcrypt.hashSync(password, 12);

  // sets body password to the newly created hash
  body.password = hash;

  try {
    // return newly created user object
    const user = await User.createUser(body);

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//@ROUTE            POST /api/login
//@DESC             logs in a user
//@ACCESS           Public
router.post('/login', (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
