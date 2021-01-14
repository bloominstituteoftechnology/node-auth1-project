const express = require('express');
const Users = require('./loginmodel');
const bcrypt = require("bcryptjs");
const router = express.Router();

// router.post('/', async (req, res, next) => {
//     const { username, password }= req.body;
//     const user= await User.findBy
//     User.login(credentials)
//       .then(user => {
//         res.status(201).json(user);
//       })
//       .catch(err => {
//         res.status(500).json({ message: 'Failed to login' });
//       });
//   });


router.post("/", async (req, res, next) => {
	try {
		const { user_name, password } = req.body
		const user = await Users.findBy({ user_name }).first()
		
		const passwordValid = await bcrypt.compare(password, user.password)
		if (!user || !passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		// generate a new session and send it back to the client
		req.body.user_name = user

		res.json({
			message: `Welcome ${user.user_name}!`,
		})
	} catch(err) {
        console.log(req)
		next(err)
	}
})
  module.exports = router;