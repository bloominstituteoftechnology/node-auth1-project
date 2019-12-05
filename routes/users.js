const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const User = require('../models/User-model');

//@ROUTE            GET /api/users
//@DESC             gets all users
//@ACCESS           Private
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find();

    if (!users[0]) {
      res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
  res.send('Gets users');
});

module.exports = router;
