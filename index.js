const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./dbAccess');

const server = express();

server.use(express.json());
server.use(cors());

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
        .catch(err => {
            console.log('/api/register POST error:', err);
            res.status(500).send('Please try again later.');
        });
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password )) {
                res.status(200).send({ message: 'Welcome!' });
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        })
        .catch(err => {
            console.log('/api/login POST error:', err);
            res.status(500).send('Please try again later.');
        });
});

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.log('/api/users GET error:', err);
            res.status(500).send('Please try again later.');
        });
});

server.listen(9000, () => console.log('\n== API on port 9k ==\n'));