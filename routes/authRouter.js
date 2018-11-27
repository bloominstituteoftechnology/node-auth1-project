const router = require('express').Router()
const {
  loginUser,
  registerUser,
  logoutUser
} = require('../controllers').authController

//* Import Local Middleware
const checkCredentials = require('../middleware/checkCredentials')

//* Auth endpoints
router.post('/login', loginUser)

router.post('/register', checkCredentials, registerUser)

router.get('/logout', logoutUser)
module.exports = router
