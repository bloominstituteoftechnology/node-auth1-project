const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('We have liftoff!');
});

server.get('/users', (req, res) => {
    db('users')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('./register', function(req, res) {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    db('users')
    .insert(user)
    .then(function(ids) {
        db('users')
        .where({ id: ids[0] })
        .first()
        .then(user => {
            res.status(201).json(user);
        });
    })
    .catch(function(error) {
        res.status(500).json({ error });
    });
});

server.post('/login', function(req, res) {
    const credentials = req.body;

    db('users')
    .where({ username: credentials.username })
    .first()
    .then(function(user) {
        const passwordsMatch = bcrypt.compareSync(credentials.password, user.password);
        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
            return res.status(401).json({ error: 'Incorrect credentials' });
          }
    })
    .catch((function(error) {
        res.status(500).json({ error });
    }));
});

server.listen(3300, () => console.log('\n running on port 3300 \n'));