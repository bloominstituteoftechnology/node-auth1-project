const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);
const server = express();

server.use(express.json());
server.use(cors());
// server.use(helmet());
server.use(morgan('dev'));

server.get('/', (req, res) => {
    res.status(200).json({message: 'Alive on post 3300'})
})

server.get('/api/users', (req, res) => {
    db('users')
    .select('id', 'username', 'password') // added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
})


server.post('/api/register', (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users').insert(creds)
        .then(ids => {
            res.status(201).json(ids)
        })
        .catch(err => console.log(err));
})

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users').where({username: creds.username}).first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(201).json({message: 'logged in'})
                return
            }
            res.status(401).json({mesasge: 'error logging in'})
        })
        .catch(err => console.log(err));
});


server.listen(3300, () => console.log("\nServer listening on port 3300\n"))
