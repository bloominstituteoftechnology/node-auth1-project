const express = require('express');
const server = express();
const helmet = require('helmet');
const bcrypt = require('bcryptjs')
const cors = require('cors');
const logger = require('morgan')
const session = require('express-session')
//db
const Users = require('../model/userModel');

//sessionConfig 
const sessionConfig = {
    name:'user',
    secret: 'keep it secret keep it safe',
    cookie:{
        maxAge: 2000 *30,
        secure: false ,//true in production
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}

//middlewares
server.use(express.json(), helmet(), cors(), logger('short'), session(sessionConfig))



//ENDPOINTS

//Register new user

//POST -- Register new user

server.post('/api/register', async (req, res, next)=>{

    try{

        const newUser = await (req.body);
        const hash = bcrypt.hashSync(newUser.Password, 12)
        
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

server.post('/api/login', async (req, res, next)=>{
    const {Username, Password} = req.body
    const user = await  Users.findByUsername({Username})

    .then(user=>{

        const credentials = user[0]
        
        const passwordsMatch = bcrypt.compareSync(Password, credentials.Password)

        if(user && passwordsMatch){
            
            res.status(200).json({message: `Welcome back ${credentials.Username}`})
        }else{
            res.status(400).json({messsage: `Log in failed. Credentials are invalid.`})
        }
    })
    .catch(err=>{
        res.status(400).json({message: `Login failed. Check credentials or make sure user account exists.`})
    })
    
})

//GET -- get users

server.get('/api/users', (req, res)=>{
    res.json({message: Hello})
})


//middleware



module.exports = server
