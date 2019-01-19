const express = require('express');
//const cors = require('cors');   //necessary for react frontend
const bcrypt = require('bcryptjs'); //open source Hashing

// const knex = require('knex');   // pre-Helpers
// const dbConfig = require('./knexfile'); // pre-Helpers

//add helpers later
const db = require('./database/dbHelpers.js');

const server = express();

// MIDDLEWARE TO RESTRICT ACCESS TO PROTECTED ROUTES
function protect(req, res, next) {
    if (req.session && req.session.userId){
        next();
    } else {
        res.status(400).send({ message: 'you shall not pass!!'});
    }
}

//const db = knex(dbConfig.development); // pre-Helpers

const session = require('express-session');


// Session on server side
server.use(
    session({
        name: 'notsession', // default is connect.sid
        secret: 'nobody tosses a dwarf!',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,   // 1 day in milliseconds (the age of cookies)
        }, 
        httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
        resave: false,
        saveUninitialized: false,
    })
);



const PORT = 3000;

server.use(express.json());
//server.use(cors());

server.get('/', (req , res) => {
    res.send("LIVE FROM BKK!!");
});




server.post('/api/register', (req , res) => {
    const user = req.body;
    console.log('session', req.session);
    //bcrypt goes here
    user.password = bcrypt.hashSync(user.password, 10);
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
    const creds = req.body;
    db.findByUsername(creds.username) //dbHelpers
    .then(users => {
        if (users.length && bcrypt.compareSync(creds.password, users[0].password)){
            req.session.userId = users[0].id;
            res.json({ info: "success: you're logged in"})
        } else {
            res.status(404).json({err: "Intentionally Generic: Invalid username and/or password"});
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
})



// server.get('/api/restricted', protected, (req,res) => {
//     db('users')
//     .then(users => res.json(users))
//     .catch(err => res.json(err));
// });


// only authenticated users should see this
server.get('/api/users', protect, (req,res) => {
    db.getUsers()
    .then(users => {
        res.json(users)
    })
    .catch(err => res.send(err));
})

server.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err){
            res.status(500).send("failed to logout");
        } else {
            res.send('logout successful');
        }
    })
});



server.listen(PORT, () => console.log(`running on port ${PORT}`));

