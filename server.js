const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(helmet());
server.use(express.json()); // don't forget this

//start server
server.get('/', (req, res) => {
res.send('API Running...');
});

server.post('/api/register', (req,res) => {
    //retrieve credentials
    const creds = req.body;

    //hash the password
    const hash = bcrypt.hashSync(creds.password, 3)

    //replace user password with the hash
    creds.password = hash;

    //save the user
    db('users').insert(creds)
    .then(ids => {
        const id = ids[0];
        res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err))
});

server.post('/api/login', (req,res) => {
    const creds = req.body;

    db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
        if (user && bcrypt.compardSync(creds.password, user.password)){
            res.status(401).send('Welcome');
        }else{
            res.status(401).json({message: 'You shall not pass!'});
        }
    })
    .catch(err => res.status(500).send(err));
});

//protect the route so that only authenticated users can see it
server.get('/api/users', (req,res) => {
    db('users')
    .select('id', 'username','password')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(9000, () => console.log('\n running on port 9000\n'));