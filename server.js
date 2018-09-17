// Requirements
const knex = require('knex');
const express = require('express');
const bcrypt = require('bcryptjs');
const knexConfig = require('./knexfile');

// Instantiations
const server = express();
const db = knex(knexConfig.development);

// Middleware
server.use(express.json());

// Endpoints
server.get('/', (req, res) => {
    res.status(200).send('Server is running!');
});

server.post('/api/register', (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 8);

    creds.password = hash;

    db('users_table')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id);
        })
        .catch(err => {
            console.log('/api/register POST error:', err);
            res.status(500).send('Please try again later');
        });
});

server.get('/api/users', (req, res) => {
    db('users_table').select('id', 'username').then(users => {
        res.status(201).json(users);
    }).catch(err => {
        console.log("error:", err);
        res.status(500).json(err);
    })
});


server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users_table')
    .where({username: creds.username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)){
            res.status(200).send('Welcome');
        } else {
            res.status(401).json({message: 'incorrect combination'});
        }
    }).catch(err => {res.status(500).send(err, "Everything failed")});
})






// Other Settings
const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}!`));