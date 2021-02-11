const express = require('express');
const router = express.Router();

//db
const Users = require('../../model/userModel')


router.get('/users', restricted(), async (req, res)=>{

    await Users.get()
    .then(users=>{
        
        res.status(200).json({users: users, session: req.session})
    }).catch(err=>{
        res.status(400).json({message: `could no retrieve users, are you root?`})
    })

})

router.get('/logout', restricted(), (req, res)=>{
    req.session.destroy(err=>{
        if(err){
            res.status(200).json({$ERR: err})
        }else{
            res.status(200).json({message: `session has been destroyed`})
        }
    })
    
})

//middleware

function restricted(){
    return(req, res, next)=>{
        if(req.session.user){
            console.log(`User valited. Continue on.`)
            next()
        }else{
    
            console.log(`Halt!`)
            res.status(500).json({message: `Halt! You are not logged in`, session: req.session})
        }
    }
}

module.exports = router;