const express = require('express');
const server = express();

const knex = require('knex');
const dbConfig = require('./knexfile');

const bcrypt = require('bcryptjs');

const db = knex(dbConfig.development)
const PORT = process.env.PORT || 8999;

server.use(express.json());

//POST	/api/register

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

//POST	/api/login

server.post('/api/login', (req, res) => {
    const checkUser = req.body;
    if(user.username && user.password){
        db('users').where('username', checkUser.username)
        .then(users => {
            if(users.length && bcrypt.compareSync(checkUser.password, users[0].password)){
                res.json({info: "Logged In"})
            } else {
                res
                .status(404)
                .json({error: 'You shall not pass!'})
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

//GET	/api/users

server.listen(PORT, () =>{
    console.log(`Server is listening on ${PORT}`)
})