const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/dbHelpers');

const server = express();
const PORT = 5000;
server.use(express.json());

server.get('/', (req, res) => {
    db.getUsers()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({err: 'error getting users'})
    })
});

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 14);

    if(user.username && user.password) {
        db.addUser(user)
        .then(id => {
            res.status(201).json({id: id[0]});
        })
        .catch(err => {
            res.status(500).json({err: 'error adding new user'})
        })
    } else {
        res.status(400).json({err: 'username or password missing'})
    }
});

server.post('/api/login', (req, res) => {
    const user = req.body;

    db.findUser(user.username)
    .then(userInfo => {
        if(userInfo.length && bcrypt.compareSync(user.password, userInfo[0].password)) {
                res.json({message: 'Logged in'})
            } else {
                res.status(404).json({err: 'username or password incorrect'})
            }
        })
    .catch(err => {
        res.status(500).json({err: 'error logging in'})
    })
})


server.listen(PORT, () => {
    console.log(`listenig on port ${PORT}`)
})