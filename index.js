const express = require('express');
const server = express();

const knex = require('knex');
const dbConfig = require('./knexfile');

const bcrypt = require('bcryptjs');

const db = knex(dbConfig.development)
const PORT = 7654

server.use(express.json());


server.get('/api/users', (req, res) => {
    db('users').then( user => {
        res.status(200).json(user)
    }) 
    .catch(error => { res.status(400).json({error: "there was an error"})})
})

server.post('/api/register', (req, res) => {
    const user = req.body;
    if(user.username && user.password){
        user.password = bcrypt.hashSync(user.password);
        db('users').insert(user)
        .then( ids => {
            res
            .status(201)
            .json({id: ids[0]})
        })
        .catch(err => {
            res.status(500).send(err)
        })
    } else {
        res
        .status(400)
        .json({errorMessage: "Please provide a username and password"})

    }
});

server.post('/api/login', (req, res) => {
    const userInfo = req.body;
    if(user.username && user.password){
        db('users').where('username', userInfo.username)
        .then(users => {
            if(users.length && bcrypt.compareSync(userInfo.password, users[0].password)){
                res.json({info: "You are now logged in"})
            } else {
                res
                .status(404)
                .json({error: 'Incorrect username or password'})
            }
        })
        .catch(err => {
            res
            .status(500)
            .send(err)
        })
    } else {
        res
        .status(400)
        .json({errorMessage: "Please provide your username and password"})
    }
}); 

server.listen(PORT, () =>{
    console.log(`Server is listening on ${PORT}`)
})