// Define dependancies
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database/dbHelpers.js');
const session = require('express-session');

const server = express();

// Set up use's && session
server.use(express.json());
server.use(cors());
server.use(session({
    name: 'notsession',
    secret: 'lmao',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true, // Js get off my cookies
    resave: false,
    saveUninitialized: false,
}));

// Start listening
server.get('/',(req,res) => {
    res.send("SERVER rUnNiNg");
});

// Custom Middleware //
function protect(req, res) => {
    if(req.session && req.session.userId){
        next();
    } else {
        res.status(500).send("Invalid Credentials");
    }
}

/* ENDPOINTS */

// Register Endpoint // 
server.post('/api/register', (req, res) => {
    const user = req.body;
    console.log(req.session);
    user.password = bcrpyt.hashSync(user.password, 10);
    db.insert('users')
        .then(id => {
            res.status(201).send({id: ids[0]});
        })
        .catch(err => {
            res.status(500).send(err);
        });
    
});

// Login Endpoint //
server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    db.findByUsername(bodyUser.username)
    .then(users => {
        console.log("Body user", bodyUser);
        console.log("DB user", users[0]);
        // 
        if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)){
            res.json({info: "Valid Credentials"});
        } else {
            res.status(404).json({err: "Nah bro"});
        }
    })
    .catch(err => {

     });
});

// Logout Endpoint // 
server.post('api/logout', (req,res) => {
    req.session.destroy(err => {
        if(err){
            res.status(500).send("Failed to log out");
        } else {
            res.send("Logout Successful");
        }
    });
});

// protect this route, only authenticated users should see it
server.get('/api/users', protect, (req, res) => {
    console.log('session', req.session);
    if(req.session && req.session.userId){
        db.findUsers()
            .then(users => {
                res.json(users);
        })
        .catch(err => {
            res.status(500).send(err);
        })
    } else {
        res.status(400).send('ACCESS DENIED');
    }
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
