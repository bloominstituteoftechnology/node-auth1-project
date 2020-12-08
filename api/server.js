const express = require('express');
const server = express();
const helmet = require('helmet');
const bcrypt = require('bcryptjs')
const cors = require('cors');


//db
const db = require('../data/dbConfig')

//middlewares
server.use(express.json(), helmet(), cors())



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
    }


})


//POST -- log in user

server.post('/api/login', (req, res)=>{
    
    const loggedUser = req.body

    
})

//GET -- get users

server.get('/api/users', (req, res)=>{
    res.json({message: Hello})
})




module.exports = server