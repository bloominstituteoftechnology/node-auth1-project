const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs')

//db
const Users = require('../../model/userModel');
const session = require('express-session');

module.exports = router;


const authError = {$ERR: `Invalid Credentials!!`}


//POST -- Register new user

router.post('/register', async (req, res, next)=>{
    try{
        const newUser = await (req.body);
        const hash = bcrypt.hashSync(newUser.password, 12)
        
        newUser.Password = hash
        await Users.insert(newUser)
        .then(resolve=>{
            res.json({message: 'user created',
                newUser: newUser})
        })
        .catch(err=>{
            res.status(500).json({message: `Could not register, user already exists.`})
        })
    }
    
    catch (err){
        next(err);
        res.status(400).json({
            message: `Could not register new user.`
        })
    }
})


//POST -- log in user

router.post('/login', async (req, res, next)=>{
    let { username, password} = req.body


  try {
        let user = await  Users.findBy({username})
        user = user[0];
        
        if (user && bcrypt.compareSync(password, user.password) ){
            req.session.user = user;
            res.status(200).json({message: `Welcome back ${user.username}`, user: user, session: req.session})
    
        }else{
            res.status(400).json({1:authError})
        }    
    }
    
    catch(err){
        res.status(400).json({2:authError});
    };
})
