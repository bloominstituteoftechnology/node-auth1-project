const express = require("express");
const bcrypt = require('bcryptjs')
const router = express.Router();
const db = require("../models/userInfoModel");

router.get('/', (req,res) => {
    db.get().then(userInfo => {
        res.json(userInfo)
    })
})

router.get('/users', (req,res) => {
    db.getAllUsernames().then(usernameList => {
        const usernameArray = []
        usernameList.forEach(user => {
            usernameArray.push(user.username)
        });
        res.json({usernames: usernameArray})
    })
})

router.post('/register', (req,res) => {
    const {username, password} = req.body
    const hash = bcrypt.hashSync(password, 14)
    db.add({username, password: hash}).then(() => {
        db.get().then(userInfo =>{
            res.json(userInfo)}
        )
    }) 
})

router.post('/login', (req,res) => {
    let {username, password} = req.body
    db.getByUsername(username).then(userInfo => {
        if(userInfo && bcrypt.compareSync(password, userInfo.password)){
            res.json({message:'logged in'})
        }else{
            res.json({message: 'nope'})
        }
    })
})

module.exports = router;
