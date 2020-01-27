const router = require('express').Router();
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
// const server = require('./server.js');

router.use('/users', usersRouter);

router.get("/", (req,res)=>{
    res.json(`Api is working`)
})

module.exports = router;
