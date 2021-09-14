// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router();
const User = require('../users/users-model');
const bcrypt = require('bcryptjs');
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware');


router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const newUser = { username, password: hash };
    const user = await User.add(newUser);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [existingUser] = await User.findBy({ username });
    if (existingUser && bcrypt.compareSync(password, existingUser.password)) {
      req.session.user = existingUser;
      res.status(200).json({
        message: `Welcome ${existingUser.username}`
      });
    } else {
      next({
        message: 'Invalid credentials',
        status: 401
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.json({
          message: 'error, you cannot leave'
        });
      } else {
        res.status(200).json({
          message: "logged out"
        });
      }
    });
  } else {
    res.status(200).json({
      message: 'no session'
    });
  }
});

module.exports = router;
