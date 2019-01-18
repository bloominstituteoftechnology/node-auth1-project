const ENV = 'development';
const express = require('express');
const knex = require('knex');
const dbCONFIG = require('./knexfile.js');

const server = express();
const db = knex(dbCONFIG[ENV])
server.use(express.json())

const PORT = 4444;

server.get('/api/users', (req, res) => {
    db('users')
    .then(info => {
        res.json(info)})
        .catch(err => {
            res.status(500).json({err: `${err} Something went wrong`})
        })
})

server.post('/api/register', (req,res) => {
    const user = req.body;
    const missing = ['username', 'password', 'registered'].filter(item => {return user.hasOwnProperty(item) === false})
    if(missing.length===0)
    {db('users').insert(user)
    .then(ids => {
        res.status(201).json(res.json({message: `user ${user.username} added`}))})
    .catch(err => {
        res.status(500).json({err: `Could not add user! ${err}`})
    })
    }

    else {res.status(500).json({message: `missing info: ${missing}`})}
    })

    server.post('/api/login', (req,res) => {
        const user = req.body;
        
        db('users').where('username', user.username)
        .then(users => {
            if (users.length && user.password === users[0].password){
                res.json({message: `Success!`})}
            else {
                res.json({message: `invalid username or password`})
            }})
        .catch(err => {
            res.status(500).json({message: `Could not login`})
        })})



server.listen(PORT, (err) => {
    if (err) {console.log(err)}
    else {console.log(`listening on port ${PORT}`)}
})