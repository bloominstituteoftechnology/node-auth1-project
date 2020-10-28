const express = require("express")
const Users = require('./user-model')
const bcrypt = require("bcrypt")
const session = require("express-session")
const {restrict} = require("./middleware")

const router = express.Router()

router.post('/login', async (req,res,next)=> {
    try {
        const {username, password} = req.body
        const user = await Users.findUser(username).first()

        if (!user) {
            return res.status(401).json({message: "invalid user"})
        }

        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid){
            return res.status(401).json({message: "invalid password"})
        }
        req.session.user = user
        res.json({message: `welcome ${user.username}`})
    } catch(er){
        next(er)
    }
})

router.post("/register",async (req,res,next)=> {
    try{
    const {username, password} = req.body
    const user = await Users.findUser({username}).first()

    if (user){
        return res.status(409).json({message: "username already exists"})
    }

    const newUser = await Users.addUser({
        username,
        password: await bcrypt.hash(password, 13)
    })

    res.status(201).json({newUser})}
    catch(er){
        next(er)
    }
})

router.get("/users", restrict(), async (req,res,next) => {
    try{
        res.json(await Users.findAllUsers())
    }catch(er){next(er)}
})

router.get("/logout", async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})
 












module.exports = router