const express = require('express');
const router = express.Router();

//db
const Users = require('../../model/userModel')


router.get('/users', async (req, res)=>{

    await Users.get()
    .then(users=>{
        res.status(200).json({users: users})
    }).catch(err=>{
        res.status(400).json({message: `could no retrieve users, are you root?`})
    })

})

module.exports = router;