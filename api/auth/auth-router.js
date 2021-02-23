const express = require('express');
const router = express.Router();
const User = require('../users/users-model')
const bcrypt = require('bcryptjs');
const mw = require('../middleware/middleware')

router.post('/register', mw.checkPayload, mw.checkUserInDb, async (req, res) =>{
    try{
        const hash = bcrypt.hashSync(req.body.password, 10)
        const newUser = await User.add({username: req.body.username, password:hash})
        res.status(201).json(newUser)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/login', mw.checkPayload, mw.checkUserExists, (req, res) =>{
    try{
        const verified = bcrypt.compareSync(req.body.password, req.userData.password)
        if(verified){
            req.session.user = req.userData
            res.status(200).json(`Welcome back ${req.userData.username}.`);
        }
    } catch(error){
        res.status(500).json({message: error.message})
    }
});

module.exports = router;