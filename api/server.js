const express = require('express');
const server = express();
const helmet = require('helmet');
const bcrypt = require('bcryptjs')
const cors = require('cors');
const logger = require('morgan')
const session = require('express-session')
//db
const db = require('../data/dbConfig')

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

        await db.insert({
            Username: `${newUser.Username}`,
            Password: `${newUser.Password}`
        })
        .into('user_table')

        res.json({message: 'user created',
                newUser: newUser})

    }
    
    
    catch (err){
        next(err);
        res.status(400).json({
            message: `Could not register new user.`
        })
    }


})


//POST -- log in user

server.post('/api/login', validateUser(), (req, res)=>{
    
    res.status(200).json({message: 'Hellock', user: req.credentials})
    
})

//GET -- get users

server.get('/api/users', (req, res)=>{
    res.json({message: Hello})
})


//middleware



module.exports = server
