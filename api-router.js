const bcrypt = require('bcryptjs');
const router = require('express').Router();

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
  res.json({ api: "It's alive" });
});

router.post('/hash', (req, res) => {
  // read a password from the body
  const password = req.body.password;

  // hash the password using bcryptjs
  const hash = bcrypt.hashSync(password, 12);

  // return it to the user in an object that looks like
  // { password: 'original passsword', hash: 'hashed password' }
  res.status(200).json({ password, hash });
});

// $2a$08$1kMv.s4r.qlAXTe0oKHU8u3kWEVZxkUOBwdCuQP4qwshieyR03rOq
// $2a$08$1ay31448JC7RYlBOTaqlzeZMA22U9czIh/xK5QuDXEtXwMGHFMDT6

module.exports = router;
