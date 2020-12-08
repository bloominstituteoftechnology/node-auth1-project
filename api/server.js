const express = require('express');
const server = express();




//ENDPOINTS

//Register new user

//POST -- Register new user

server.post('/api/register', (req, res)=>{
    const newUser = req.body
})


//POST -- log in user

server.post('/api/login', (req, res)=>{
    const loggedUser = req.body
})

//GET -- get users

server.get('/api/users', (req, res)=>{
    
})




module.exports = server