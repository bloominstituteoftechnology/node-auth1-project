const express = require('express');
const data = require('../models/dataModel.js');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/register', (req, res)=>{
    const hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    const {username, password} = req.body;
    const user = {username, password};
    data.register(user)
        .then(ids =>{
            const id = ids[0];
            res.status(201).json({newUserId: id});
        })
        .catch(err => res.status(500).json(err.message));
});

router.post('/login', (req, res)=>{
    const {username, password} = req.body;
    const credentials = {username, password};
    data.login(credentials)
        .then(user=>{
            if(user){
                if(bcrypt.compareSync(credentials.password, user.password)){
                    res.status(200).json({welcome: user.username});
                }else{
                    res.status(401).json({message:'Username and password do not match.'});
                }
            }else{
                res.status(400).json({message:'Username not found.'});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

router.get('/users', (req, res)=>{
    data.getUsers()
        .then(users=>{
            if(users.length>0){
                res.status(200).json(users);
            }else{
                res.status(400).json('No users in database.');
            }
        })
        .catch(err => res.status(500).json(err.message));
});

module.exports = router;