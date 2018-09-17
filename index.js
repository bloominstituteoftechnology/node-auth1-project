const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const server = express()
const db = require('./db/helpers')

server.use(express.json)
server.use(helmet())

server.get('/', (req, res) => {
    res.send('working')
})

server.post('/api/register', (req, res) => {
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;

                res.status(200).send({ message: `Welcome ${req.session.username}` })
            } else {
                res.status(401).json({ errMessage: 'Your username and/or password is invalid' });
            }
        })
        .catch(err => res.status(500).send(err));
})

server.get('/api/users', (req, res) => {
});

const port = 8000
server.listen(port, console.log(`\n ===> Server is running on port ${port} <=== \n`))