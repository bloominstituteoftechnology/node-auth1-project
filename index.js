const express = require('express');
const server = express();
const logger = require('morgan');
const helmet = require('helmet');
const PORT = 4000;
const dbhelper = require('./dbhelper')
const bcrypt = require('bcryptjs');
server.use(express.json());
server.use(helmet());
server.use(logger('dev'))
server.disable("etag");

server.post('/api/register', (req, res) => {
    const newUser = req.body;
    if (!!newUser.password || !!newuser.username) {
        return res.status(404).json('Please provide Username and/or password')
    }
    newUser.password = bcrypt.hashSync(newUser.password, 14);
    dbhelper.registerUser(newUser)
        .then(res.status(201).json())
        .catch(res.status(500).json())
})

server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    dbhelper.findByUser(bodyUser.username)
        .then(user => {
            if (user.length && bcrypt.compareSync(bodyUser.password, user[0].password)) {
                res.json({ message: 'Logged In!' })
            } else {
                res.json({ message: 'You shall not pass!' })
            }
        })
        .catch(res.status(500).json())
})

server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`server is listening on port ${PORT}`);
});