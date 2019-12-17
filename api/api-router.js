const router = require('express').Router()

const authRouter = require('../auth/auth-router')
const userRouter = require('../users/users.router')

router.use('/auth', authRouter)
router.use('/users', userRouter)

router.get('/', (req, res) => {
    res.json({ api: `It's Alive` })
})



module.exports = router

