// Imports
const router = require('express').Router()
const authRouter = require('../auth/auth-router')
const userRouter = require('../users/user-router')
const restricted = require('../auth/auth-middleware')

router.use('/auth', authRouter)
router.use('/users', restricted, userRouter)

router.get('/', (req,res) => {
    res.json({api: 'Welcome to party town'})
})

module.exports = router