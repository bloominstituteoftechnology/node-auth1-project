const router = require('express').Router()
const { getUsers } = require('../controllers/userController')

//* Local Middleware
const validateUser = require('../middleware/validateUser')

router.get('/', validateUser, getUsers)

module.exports = router
