const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');

const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(cors());

server.post('/api/login', (req,res) => {
    const cred = req.body;

    db('users')
        .where({username: cred.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(cred.password, user.password)) {
                res.status(201).json({ message: 'login successful' });
            } else {
                res.status(401).json({ message: 'access denied' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'could not log you in' });
        })
});

server.post('/api/register', (req, res) => {
    const cred = req.body;

    const hash = bcrypt.hashSync(cred.password, 12);

    cred.password = hash;

    db('users')
        .insert(cred)
        .then(ids => {
            res.status(201).json(ids)
        })
        .catch(err => {
            res.status(500).json({ message: 'could not register', err });
        });
});

server.get('/', (req, res) => {
    res.send('running');
  });
  
server.get('/api/users', (req, res) => {
    db('users')
    .select('id', 'username') // ****** added password earlier to see if it worked
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
  });
  
  server.listen(8300, () => console.log('\nrunning on port 8300\n'));