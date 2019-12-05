//? s13
const router = require('express').Router();

//? s15 
const authRouter = require('../auth/auth-router.js');

//? s15a create file auth-router.js under auth folder

//? s16
const usersRouter = require('../users/users-router.js');

//? s17
// /api/auth
router.use('/auth', authRouter);
//? s18
// /api/users
router.use('/users', usersRouter);

//? s19
// /api
router.get('/', (req, res) => {
  res.json({ api: "Server is good to go!" });
});

//? s14
module.exports = router;
