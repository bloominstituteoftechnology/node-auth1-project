const express = require('express')
const bcrypt = require("bcryptjs")
const router = express.Router()
const { restrict } = require("./users-middleware")

const User = require('./users-model')


router.get("/",  restrict(), async (req, res, next) => {
	try {
		res.json(await User.find())
	} catch(err) {
		next(err)
	}
})

module.exports = router