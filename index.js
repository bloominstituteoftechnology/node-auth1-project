const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

// Endpoints 
server.get('/', (req, res) => {
  res.send('Server online');
});

server.post('/api/register', (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 9);

    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err));
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3600, () => console.log('\nrunning on port 3600\n'));
