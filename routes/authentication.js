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
router.post('/login', async (req, res) => {
  const { body } = req;
  const { username, password } = body;

  // if username or password isn't in req body, reject
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const user = await User.findBy({ username });

    // if user does not exist, reject
    if (!user) {
      res.status(404).json({ message: 'User does not exist' });
    }

    // using the user above, we'll compare the pw in req with hashed pw
    // if no match, reject
    if (!bcrypt.compareSync(password, user.password)) {
      res.status(400).json({ message: 'Invalid credentials' });
    }

    // if there is a match, respond with the user
    res.status(200).json({ message: `Welcome, ${user.username}!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
