const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const db = require('./database/dbConfig.js');
const PORT = 3300;
const server = express();

server.use(express.json());
server.use(cors());

server.post('/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash;
    db('users')
        .insert(user)
        .then(ids => {
            const id = ids[0];
            res.status(201).json({ newUserId: id });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                // found the user
                req.session.username = user.username
                res.status(200).json({ welcome: user.username });

            } else {
                res.status(401).json({ message: 'you shall not pass!' });
            }
        })
        .catch(err => res.status(500).json({ err }));
});


server.get('/users', protected, (req, res) => {
    // only if the device is logged in 
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));

});

server.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send("you cant leave")
            } else {
                res.send('goodbye');
            }
        })
    }
})

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('You Shall not pass!');
    }
}


server.listen(PORT, () => {
    console.log(`server is up and running on port ${PORT}`);
})