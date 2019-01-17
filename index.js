const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);
const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());
server.use(helmet());

// ----- End Points ----- //

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 14);
    db('user').insert(user)
    .then(ids => {
        res.status(201).json({ids: ids[0]});
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

server.post('/api/login', (req, res) => {
    const user = req.body;
    db('user').where('userName', user.userName)
    .then(user => {
        if (user.length && bcrypt.compareSync(user.password, user[0].password)) {
            res.json({ info: "correct"});
        } else {
            res.status(404).json({ err: "invalid username or password"});
        }
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

server.get('/api/users', (req, res) => {
    db('user')
    .select('id', 'userName')
    .then(user => {
        res.json(user);
    })
    .catch(err => {
        res.send(err)
    });
});


// ----- Server Listening ----- //
server.listen(9000, () => {
    console.log('App running on port 9000')
})