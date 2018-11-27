const router = require('express').Router()
const { restrictedRoute } = require('../controllers/').restrictedController

//* Import Local Middleware
const validateUser = require('../middleware/validateUser')

//* Restricted endpoints
router.get('/', validateUser, restrictedRoute)

module.exports = router
