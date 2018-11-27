const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const server = express();
const db = require('./data/db');
const auth = require('./auth.js');

server.use(express.json());

server.use(
    session({
      name: 'notsession', // default is connect.sid
      secret: 'nobody tosses a dwarf!',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
      }, // 1 day in milliseconds
      secure: false,
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false,
      saveUninitialized: false,
    })
    
);

const port = 3300;

server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
    
});



server.post('/api/register', (req, res) => {
    let userInfo = req.body;
    const hash = bcrypt.hashSync(userInfo.password, 8);
    userInfo.password = hash;
    db.register(userInfo)
    .then(id => {
        res.status(201).json(id);
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

server.post('/api/login', (req,res) => {
    let userInfo = req.body;
    db.login(userInfo)
    .then(user => {
        
        if(user && bcrypt.compareSync(userInfo.password, user.password)) {
            req.session.name = userInfo.usersname;
            req.session.save();
            console.log(req.session);
            res.status(200).json({message: 'Logged In', id: user.id})
            
        } else {
            res.status(401).json({message: 'You shall not pass!'})
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

server.get('/api/users', (req,res) => {
    const name = req.session.name;
    if(req.session.name) {
        db.getUsers()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    } else {
        res.status(401).json({message: 'You shall not pass!'})
    }
})

server.get('/api/restricted/BOO', auth,  (req,res) => {
    res.status(200).json({message: 'HEYYYYY'})
})