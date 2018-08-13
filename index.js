const express = require('express');

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
    
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

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

server.listen(3300, () => console.log('\n running on port 3300 \n'));