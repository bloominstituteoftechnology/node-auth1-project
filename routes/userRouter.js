const router = require('express').Router()
const { getUsers } = require('../controllers').userController

//* Import Local Middleware
const validateUser = require('../middleware/validateUser')

//* User endpoints
router.get('/', validateUser, getUsers)

module.exports = router
