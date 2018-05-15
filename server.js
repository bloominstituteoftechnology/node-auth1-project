const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./users/User');

mongoose
    .connect('mongodb://localhost/authenticatedb')
    .then(conn => {
        console.log('\n== connected to mongoDB')
    })
    .catch(err => {
        console.log('error connecting to mongo', err)
    })

const server = express();

authen = (req, res, next) => {
    User
        .find({ username: req.body.username })
        .then(users => {
            const userPassword = users[0].password;
            bcrypt.compare(req.body.password, userPassword, (err, result) => {
                if (result) next();
                else res.send('wrong password')
            });
        })
}

server.use(express.json());

server.get('/', (req, res) => {
    res.send("Api Running")
})

server.get('/api/users', (req, res) => {
    User
        .find()
        .then(users => res.status(200).send(users))
        .catch(err => res.status(500).send(err));
});

server.post('/api/register', (req, res) => {
    const user = new User(req.body);

    user
        .save()
        .then(user => res.status(200).send(user))
        .catch(err => res.status(500).send(err, console.log(err)));
});

server.post('/api/login', authen, (req, res) => {
    res.send('successful login');
})

const port = 5000;
server.listen(port, () => console.log(`\n=== API running on ${port} ===\n`));