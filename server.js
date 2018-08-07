const express = require('express');
const db = require('./data/db');

const bcrypt = require('bcryptjs');
const server = express();

server.use(express.json());


server.get('/', (req, res) => {
    res.send(`8080's up and running.`);
});

server.get('/api', (req, res) => {
    res.send(`Hey, welcome to the API.`);
});

// POST | Register -- See that your registration goes through.

server.post('/api/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;
    
    db('users')
        .insert(user)
        .then(ids => {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    res.status(201).json(user);
                });
        })
        .catch(err => {
            res.status(500).json({ err });
        })
});

// PUT | Login -- See that your login is either successful or unsuccessful

server.put('/api/login', (req, res) => {
    const credentials = req.body;
    
    db('users')
        .where({ username: credentials.username })
        .then(user => {
            console.log(user);
            user[0] && bcrypt.compareSync(credentials.password, user[0].password) 
            ? db('users')
                .where({ username: credentials.username })
                .update({loggedIn: 1})
                .then(success => {
                    res.status(200).json({message: `Welcome to the world, ${ credentials.username }!`, user }) 
                })
            : res.status(401).json({error: 'Incorrect credentials. Try again.'});
        })
        .catch(err => {
            res.status(500).json( err.message );
        })
});

// PUT | Logout -- See that your login is either successful or unsuccessful

server.put('/api/logout', (req, res) => {
    const { username } = req.body;

    db('users')
        .where({ username })
        .first()
        .update({ loggedIn: 0})
        .then(user => {
            res.status(200).json(`Okay, you've been successfully logged out! We'll see you next time, ${ username }!`)
        })
        .catch(err => {
            res.status(500).json({ err });
        })
});

// GET | See your users

server.get('/api/users', (req, res) => {
    db('users')
    .then(users => {
        res.status(200).json({users});
    })
    .catch( err => {
        res.status(500).json({ err });
    })
})

const port = 8080;
server.listen(port, function() {
    console.log(`Web API listening on http://localhost/${port} . . .`)
})