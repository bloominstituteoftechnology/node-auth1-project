const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('../user/user-model');

const router = express.Router();

router.post("/register", async (req, res, next) => {
	try {
		const { username } = req.body
		const user = await Users.findBy({ username }).first()
        //When they try to register check if the username is taken.
		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}
        //add the user with a hashed password to the database
		res.status(201).json(await Users.add(req.body))
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user =  await Users.findBy({username}).first()

        //since bcrypt hashes generate different results due to salting
        //we rely on bcrpyt magic internals to compare hashes
        //rather than doing it manaully with !==
        const passwordValid = await bcrypt.compare(password, user.password)

        if(!user || !passwordValid) {
            return res.status(401).json({
                message: "INVALID CREDENTIALS"
            })
        }
        req.session.user = user;
        res.status(200).json({message: "Welcome user"})

    }catch(err) {
        next(err);
    }
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.json({message: "We're sorry, but an error has occurred"})
            }else {
                res.status(200).json({message: 'You have been logged out!'})
            }
        })
    }else {
        res.status(200).json({message: "You weren't even logged in, dude."})
    }
})

module.exports = router;