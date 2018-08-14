const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./data/db.js');
const server = express();


server.use(express.json());
server.use(
    session({
        name: 'notsession',
        secret: 'whatevs',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: false,
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: true,
    })
);


// ==== USER REQUESTS ====

server.post('/register', (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    db('users')
        .insert(user)
        .then( ids => {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then( user => {
                    res.status(201).json(user);
                })
        })
        .catch(err => res.status(500).json(err))
})

server.post('/login', (req, res) => {
    const credentials = req.body;
    console.log('credentials:' + credentials);

    db('users')
        .where({ name: credentials.name })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.userId = user.id;
                res.status(200).json(`Success: ${user.name} is logged in!`)
            } else {
                return res.status(401).json({ error: 'you shall not pass!'})
            }
        })
})

server.get('/users', (req, res) => {
    if (req.session && req.session.userId === 1) {
        db('users')
            .then(users => {
                res.status(200).json(users)
            })
            .catch( err => res.status(500).json(err) )
    } else {
        return res.status(401).json({ errorMessage: 'invalid credentials'})
    }
})


server.listen(3300, () => console.log('\n==== API is running... ====\n'))