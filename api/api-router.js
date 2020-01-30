const router = require('express').Router();

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');


router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
  res.json({ api: "Something is happening" });
});

module.exports = router;