const express = require('express');
//const cors = require('cors');   //necessary for react frontend
const bcrypt = require('bcryptjs'); //open source Hashing

// const knex = require('knex');   // pre-Helpers
// const dbConfig = require('./knexfile'); // pre-Helpers

//add helpers later
const db = require('./database/dbHelpers.js');

const server = express();
//const db = knex(dbConfig.development); // pre-Helpers

const session = require('express-session');

/// GLOBAL MIDDLEWHERE SESSION COOKIES
// configure express-session middleware
server.use(
    session({
        name: 'notsession', // default is connect.sid
        secret: 'nobody tosses a dwarf!',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,   // 1 day in milliseconds
            secure: true, // only set cookies over https. Server will not send back a cookie over http.
        }, // 1 day in milliseconds
        httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
        resave: false,
        saveUninitialized: false,
    })
);

// global middleware ensures a user is logged in when accessing any route prefixed by /api/restricted/
// /api/restricted/      /api/restricted/something...
server.get('/setname', (req,res) => {
    req.session.name = 'Frodo';
    res.send('got it');
});

server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send(`hello ${req.session.name}`);
});



const PORT = 3000;

server.use(express.json());
//server.use(cors());

server.get('/', (req , res) => {
    res.send("LIVE FROM BKK!!");
});







server.post('/api/register', (req , res) => {
    const user = req.body;
    //bcrypt goes here
    user.password = bcrypt.hashSync(user.password, 14);
    //db('users').insert(user)
    db.insertUser(user)   //dbHelpers
    .then(ids => {
        res.status(201).json({id: ids[0]});
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    db.findByUsername(bodyUser.username) //dbHelpers
    .then(users => {
        if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)){
            res.json({ info: "success: you're logged in"})
        } else {
            res.status(404).json({err: "Intentionally Generic: Invalid username and/or password"});
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
})

//MIDDLEWARE TO RESTRICT ACCESS TO PROTECTED ROUTES
function protected(req, res, next) {
    if (req.session && req.session.username){
        next();
    } else {
        res.status(401).json({ message: 'you shall not pass!!'});
    }
}

server.get('/api/restricted', protected, (req,res) => {
    db('users')
    .then(users => res.json(users))
    .catch(err => res.json(err));
});


// only authenticated users should see this
server.get('/api/users', (req,res) => {
    db.getUsers()
    .select('id','username')
    .then(users => {
        res.json(users)
    })
    .catch(err => res.send(err));
})




server.listen(PORT, () => console.log(`running on port ${PORT}`));

