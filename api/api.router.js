const bcrypt = require('bcryptjs')
const router = require('express').Router();
//npm install bcryptjs



const authRouter = require('../auth/auth-router')
const usersRouter = require('../users/users-router')

router.use('/auth', authRouter)
router.use('/users', usersRouter)

router.get('/', (req, res) => {
    res.json({ api: "api router" });
  });

router.post('/hash', (req, res) => {
    //read password from body
    const password = req.body.password
    //hash the password using bcryptjs
    const hash = bcrypt.hashSync(password, 8);

    // return it to the user in an object that looks like
  // { password: 'original passsword', hash: 'hashed password' }
  res.status(200).json({password, hash});

})
module.exports = router