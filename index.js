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
            secure: false
        },
        httpOnly: true,
        resave: false,
        savUninitialized: false
    })
);

function checkLogIn (req, res, next) {
    if(req.session && req.session.userId){
        next();
    } else {
        return res.status(401).json({error: 'Incorrect credentials'})
    }
}


server.get('/api/restricted/users', checkLogIn, (req, res) => {
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
            req.session.userId = user.id;
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

server.get('api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err){
            res.json({error: "Error logging out"})}
        })
    } else {
        res.send("Goodbye")
    }
})


server.listen(8000, console.log('API running'));