const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./dbConfig.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

// endpoints

server.get('/', (req, res) => {
    res.send('Abracdabra!');
});

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;

    db('users')
    .insert(creds)
    .then(ids => {
        const id = ids[0];

        res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err))
});

server.post('/api/login', (req ,res) => {
    const creds = req.body;

    db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
            res.send(200).send('Welcome');
        } else {
            res.status(401).json({ message: 'incorrect credentials'});
        }
    })
    .catch(err => res.status(500).send(err))

});

server.get('/api/users', (req, res) => {
    db('users')
    .select('id', 'username', 'password')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(6600, () => console.log('\nrunning on port 6600\n'));

