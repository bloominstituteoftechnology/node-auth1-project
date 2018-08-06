const express = require('express');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);


const server = express();

server.use(express.json());

server.get('/', (req, res, next)=> {
    res.send('Welcome')
})

server.get('/users', (req, res, next)=> {
 db('users').then(response=>{
     let userArray = [];
     response.map(users=> {
      userArray.push(users.username)
     })
        res.status(200).json({users:userArray})
 })
})

server.post('/register', (req, res, next) => {
const user = req.body;
//hash pw
const hash = bcrypt.hashSync(user.password, 14);
user.password = hash;

//post to db
db('users').insert(user).then(response=> {
    res.status(200).json({Message:'You have succesfully registered!'})
})
.catch(err=>{
    res.status(500).json(err);
})
})



server.post('/login', (req, res, next) => {
//get credentials from req
const credentials = req.body;
//query db

db('users').where({username: credentials.username}).first()
.then(function(user){
if(user || bcrypt.compareSync(credentials.password, user.password)){
res.redirect('/users')
} else return res.status(401).json({
    error: 'Forbidden: Incorrect login information'
}).catch(err=> {
    res.status(500).json({err});
})
//continue...
 
})})



const port = 8000;
server.listen(port, ()=>{console.log(`server running on port ${port}`)});