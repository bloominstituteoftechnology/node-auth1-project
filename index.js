const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/db.js');
const cors = require('cors');
const session = require('express-session');

const server = express();
server.use(express.json());
server.use(cors());
server.use(
    session({
        name: "holyhandgrenade",
        secret: "Are you suggesting coconuts migrate?",
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: true
        },
        httpOnly: true,
        resave: false,
        savUninitialized: false
    })
);

/*function checkLogIn(user) {
    return function(req, res, next){
    if(!user.isLoggedIn){
        return res.status(403).json({error: 'You must be logged in to view.'})
    }
    next();
}
}*/

server.get('/setname', (req, res) => {
    req.session.name = 'erin';
    res.send('session set')
})

server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send(`Hello ${req.session.name}`)
})

server.get('/api/restricted/users', (req, res) => {
    const name = req.session.username;
    db('users').select('username')
    .then(response => {
            res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json('You shall not pass!')
    })
})

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
    .insert(credentials)
    .then(function(ids) {
        db('users')
        .where({id: ids[0]})
        .first()
        .then(user => {
            res.status(201).json(user);
        })
    })
    .catch(err => {
        res.status(500).json({error: 'There was an error saving user to database.'})
    })
})

server.post('/api/login', (req, res) => {
    const credentials = req.body;
    db('users')
    .where({username: credentials.username}).first()
    .then(function(user) {
    if(user || bcrypt.compareSync(credentials.password, user.password)) {
        req.session.userId = user.id;
        return res.status(200).json('Logged in.')
    }
    else {
        return res.status(401).json('You shall not pass!')
    }
})
})


server.listen(8000, console.log('API running'));