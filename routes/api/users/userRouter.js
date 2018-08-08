const router = require('express').Router()
const { getUsers } = require('../../../controllers/userController')

//* Local Middleware
const validateUser = (req, res, next) => {
  console.log('USER', req.session)
  if (!req.session.username) {
    return res.status(401).json('user must login to access resource')
  }
  next()
}

router.get('/', validateUser, getUsers)

module.exports = router
