const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("./user-model")
const userMiddleware = require("./user-Middleware")


const router = express.Router()


router.get("/users", userMiddleware.restrict(), async (req,res,next)=>{
    try{
      res.json(await User.find())
    }catch(err){
        next(err)
    }
})


router.post("/register", async (req,res,next)=>{
    try {
		const { username, password } = req.body
		const user = await User.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await User.add({
			username,
			password: await bcrypt.hash(password, 15),
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req,res,next)=>{
    try {
		const { username, password } = req.body
		const user = await User.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		const passwordV = await bcrypt.compare(password, user.password)

		if(!passwordV){
			return res.status(401).json({
				message: "Invalid Password",
			})
        } 
        
        req.session.user = user

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})
module.exports = router