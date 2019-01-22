const express = require('express');

const bcrypt = require('bcryptjs');

const db = require('./dbHelpers.js')

const server = express();

//this step is critical to post requests
//the json that is needed to post
server.use(express.json());

server.get('/', (req, res) => {
    res.send('api working')
});

server.get('/users', (req, res) => {
    db.getUsers()
    .then(u => {
        res.status(200).json(u)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

server.post('/api/register', (req, res) => {
    const user = req.body;
    //Hashes the password input
    user.password = bcrypt.hashSync(user.password);
    db.insert(user)
    .then(u => {
        res.status(200).json({ id: u[0] })
    })
    .catch(err => res.status(500).json(err))
});

server.post('/api/login', (req, res) => {
    //check that username exists AND passwords match
    const userInput = req.body;
    db.findByUsername(userInput.username)
    .then(u => {
        //username valid password from client == password from db
        if(u.length && bcrypt.compareSync(userInput.password, u[0].password)){
            res.json({ info: 'correct' });
        } else {
            res.status(404).json({err: 'invalid username or password'})
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
})

const port = 3300;
server.listen(port, function(){
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
})