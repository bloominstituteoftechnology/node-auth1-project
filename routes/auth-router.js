const router = require('express').Router();
const Users = require('../models/users-model.js')
const bcrypt = require('bcryptjs') 


router.post('/register', (req,res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10) 
    user.password = hash

    Users.add(user)
        .then(newuser => {
            req.session.username = newuser.username
            res.status(201).json(newuser)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: `error registering new user`})
        });
})

router.post('/login', (req,res) => {
    const { username, password } = req.body
    Users.searchBy({username})
        .then(userValid => {
            if(userValid && bcrypt.compareSync(password, userValid.password)){
                req.session.username = userValid.username; 
                res.status(200).json({messsage: `Welcome, ${userValid.username}, You are Logged In.`})

            }
            else{
                res.status(401).json({message: `Invalide credentials!`})
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: `error logging in.`})
        })
})




module.exports = router