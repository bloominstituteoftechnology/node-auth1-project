const express = require("express")
const Users = require("./usersmodel")
const { restrict } = require("./users-middleware")

const router = express.Router()

router.get("/", restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})


module.exports = router