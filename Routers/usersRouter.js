const userDb = require('../data/helpers');

//create router
const express = require('express');
router = express.Router();

//grab encryption library 
const bcrypt = require('bcryptjs');

//grab checkSession middleware function
const verify = require('../middleware');

//Register user
router.post('/register', (req, res) =>{
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 8);
    newUser.password = hash;

    userDb.addUser(newUser)
    .then(ids =>{
        //clear any previous userId off session object
        req.session.userId = '';
        res.status(201).json({newUserId: ids[0]})
    })
    .catch(err =>{
        res.status(500).json({error: "Unable to register"})
    })
})

//User login
router.post('/login', (req, res) =>{
    const loginUser = req.body;  //user provided

    userDb.getUserByName(loginUser.username)
    .then(user =>{  //returned from database
        if(user && bcrypt.compareSync(loginUser.password, user.password)){
            //add userId to session for use in verification
            req.session.userId = user.id;
            res.status(200).json(`Welcome, ${loginUser.username}`)
        }else{
            res.status(401).json({error: "You shall not pass!"})
        }
    })
    .catch(err =>{
        res.status(500).json({error:"Unable to login"})
    })
})

//Get all users - verify session before allowing access
router.get('/users',verify.checkSession, (req,res) =>{
    console.log(req.session);
    userDb.getUsers()
    .then(users =>{
        res.status(200).json(users)
    })
    .catch(err =>{
        res.status(500).json({error:"Unable to retrieve users"})
    })
})

module.exports = router;

