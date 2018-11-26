const express = require('express');
const server = express();
const knex = require('knex')
const knexConfig = require('./knexfile');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = knex(knexConfig.development);

server.use(cors());
server.use(express.json())

server.post('/api/register', (req, res) =>{
    let user = req.body;
    if(user.password && user.username){
        let hash = bcrypt.hashSync(user.password, 12)
        user.password = hash;
        console.log(hash);
        db('users').insert(user)
        .then(user => res.status(201).json({user}))
        .catch(err => res.status(500).json({message: 'Error occurred while retrieving data.'}))
    }
    else{
        res.status(401).json({message: "Please enter both a username and password."})
    }
    
})

 server.post('/api/login', (req, res) =>{
    let {password, username} = req.body;
    
    db('users').where({username}).first()
    .then(user =>{
        console.log(password, user.password)
        if(user && bcrypt.compareSync(password, user.password) ){
            res.status(200).json({message: 'Welcome!'})
        }
        else{
            res.status(401).json({ message: 'Authentication failed.' });
        }
        
    })
    .catch(err => res.status(500).json({message: 'Error occurred'}))
});



const port = process.env.PORT || 8888;
server.listen(port, ()=>console.log(`Server is listening on Port ${port}`))