const router = require('express').Router()
const { getUsers } = require('../../../controllers/userController')

router.get('/', getUsers)

module.exports = router
