const express = require('express');
const db = require('../data/helpers/usersModel');
const router = express();
const bcrypt = require('bcryptjs');
const {checkRegisterInfo, restricted} = require('../middleware');

router.get('/users', restricted, async (req, res) => {
    try{
        const users = await db.getUsers();
        if(users.length > 0){
            res.status(200).json(users)
        }else{
            res.status(401).json('Looks like there was an issue')
        }
    }
    catch(error){
        res.status(500).json('There is an issue and we are working on it!');
    }
})

router.post('/register', checkRegisterInfo, async (req, res) => {
    let {username, password} = req.body
    const hash = bcrypt.hashSync(password, 14)
    password = hash;
    const user = {username, password};
    try{
        const newUser = await db.addUser(user);
        if(newUser.length > 0){
            res.status(200).json({message: "User Registered! Please Login"})
        }else{
            res.status(401).json('Looks like there was an issue')
        }
    }
    catch(error){
        res.status(500).json('There is an issue and we are working on it!');
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await db.findUser(username)   
        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({message: 'Credentials verified!'})
        } else{
            res.status(401).json({message: 'Invalid Credentials! Please try again!'})
        }
    } 
    catch(error){
        res.status(500).json('There is an issue and we are working on it!');
    }
})

module.exports = router;
