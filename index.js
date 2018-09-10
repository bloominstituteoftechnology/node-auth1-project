const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());


server.get('/api/users', (req, res) => {
    db('users')
    .then(users => {
        res.status(201).json(users);
    })
    .catch(err =>{
        res.status(500).json({error: "The users could not be retrieved."});
    })
});



server.post('/api/register', (req, res) => {
    const creds = req.body; 
    const hash = bcrypt.hashSync(creds.password, 10);//should be no lower than 12 generally speaking
    creds.password = hash; 

    db('users').insert(creds)
    .then(ids => {
        const id = ids[0];
        res.status(201).json(id);
        })
    .catch(err => res.status(500).send(err))
});


server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).send("Welcome!")
            } else{
                res.status(401).json({message: "No passing you thief!"})
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
});


const port = 8800;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});