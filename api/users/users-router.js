const router = require('express').Router()
const {restricted} = require('../auth/auth-middleware')
const User = require('./users-model')

router.get('/', restricted, async (req,res,next) => { try {
const users = await User.find()
res.json(users)
} catch (err){next(err)}
})


module.exports = router