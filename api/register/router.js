const express = require('express');
const router = express.Router();
const User = require('../users/model')
router.post('/', async (req, res , next)=>{
    try {
        
        const hash = bcrypt.hashSync(req.body.password, 12)
        const newUser = await User.insert({
            username: req.body.username,
            password: hash
        })
        res.status(200).json("Welcome!")
    } catch (e) {
        res.status(401).json("Username already taken")
    }
})

module.exports = router