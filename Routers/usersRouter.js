const userDb = require('../data/helpers');

//create router
const express = require('express');
router = express.Router();

//grab encryption library 
const bcrypt = require('bcryptjs');

//user registration
// router.get('/', (req, res) =>{
//     res.json("hello there")
// })

router.post('/register', (req, res) =>{
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password);
    newUser.password = hash;

    userDb.addUser(newUser)
    .then(console.log(result))
    .catch(err =>{
        res.status(500).json({error: "Unable to register"})
    })
})

//user login
router.post('/login', (req, res) =>{

})

module.exports = router;

