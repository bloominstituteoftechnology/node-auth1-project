const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 

const server = express();
server.use(express.json());
server.use(cors());

const knex = require('knex');

const knexConfig = require('./knexfile');

module.exports = knex(knexConfig.development);

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).json({message: 'You are going NOWHERE!!'});
            }
        })
        .catch(err => res.json(err));
});

server.post('api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 4);
    creds.password = hash;

    db('user')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => json(err));
});

server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

server.get('/', (req, res) => {
    res.send('Its Alive!');
  });

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
