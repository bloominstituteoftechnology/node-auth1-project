const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model')

router.post('/', (req,res) => {
    let {username, password} = req.body

    Users.findBy({username})
    .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)){
            req.session.loggedIn = true;
            res.status(200).json({message: `Welcome back, ${username}!!`})
        } else{
            res.status(401).json({error: "You Shall Not Pass!"})
        }
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({ error: error.message})
    })
})
module.exports = router;