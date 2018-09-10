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
    const hash = bcrypt.hashSync(creds.password, 3);
    creds.password = hash; 

    db('users').insert(creds)
    .then(ids => {
        const id = ids[0];
        res.status(201).json(id);
        })
    .catch(err => res.status(500).send(err))
});


server.post('/api/users', (req, res) => {
    const user = req.body; 
    
    db
        .insert(user)
        .into('users')
    .then(id => {
        res.status(201).json(id); 
    })
    .catch(err => 
        res.status(500).json({error: "The user could not be posted."}));
  });


const port = 8800;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});