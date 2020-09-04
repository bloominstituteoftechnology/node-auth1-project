const express = require("express")
const Users = require("./users-model")
const bcrypt = require("bcryptjs")
const middleware = require('./users-middleware')

const router = express.Router()

// call middleware before calling code in /users route
router.get("/users", middleware.restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})
// this hashes the password
router.post("/register", async (req, res, next) => {
  try {
  		const { username, password } = req.body
  		const user = await Users.findBy({ username }).first()
  		if (user) {
  			return res.status(409).json({
  				message: "Username is already taken",
  			})
  		}
  		const newUser = await Users.add({
  			username,
  			// hash the password with a time complexity of "14"
  			password: await bcrypt.hash(password, 14),
  		})
  		res.status(201).json(newUser)
  	} catch(err) {
  		next(err)
  	}
})
// this checks the login in creds will return welcome user
router.post("/login", async (req, res, next) => {
  try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		if (!user) {
			return res.status(401).json({
				message: "'You shall not pass!",
			})
		}
		// compare the plain text password from the request body to the
		// hash we have stored in the database. returns true/false.
		const passwordValid = await bcrypt.compare(password, user.password)
		// check if hash of request body password matches the hash we already have
		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		// create a new session for the user
		// req.session.user = user
    req.session.signedIn = true
		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.post("/logout", async (req, res, next) => {
  req.session.signedIn = false
  res.status(200).json({message: 'logged out successfully'})
})

module.exports = router
