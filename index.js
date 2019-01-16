const express = require('express');
//const cors = require('cors');   //necessary for react frontend
const bcrypt = require('bcryptjs'); //open source Hashing

// const knex = require('knex');   // pre-Helpers
// const dbConfig = require('./knexfile'); // pre-Helpers

//add helpers later
const db = require('./database/dbHelpers.js');

const server = express();
//const db = knex(dbConfig.development); // pre-Helpers
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

