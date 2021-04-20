// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require("./auth-middleware.js")
const router = require("express").Router()
const users = require("../users/users-model.js")
const bcrypt = require("bcryptjs")

router.post("/register", checkPasswordLength, checkUsernameFree, (req,res,next)=>{
    const { username,  password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    users.add({username:username, password:hash})
    .then(user=>{
        res.status(200).json(user)
    })
})

router.post("/login", checkPasswordLength, checkUsernameExists, async (req,res,next)=>{
    const { username, password } = req.body
    const [user] = await users.findBy({username})
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user
        res.status(200).json({ message: `welcome ${username}` })
    } else {
        next({status: 401, message: "invalid credentials"})
    }
})

router.get("/logout", (req,res)=>{
    if (req.session && req.session.user) {
        req.session.destroy(()=> {
            res.status(200).json({message:'logged out'})
        })
    } else {
        res.status(401).json({message:"no session"})
    }
})

module.exports = router