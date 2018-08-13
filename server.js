const express = require ('express');
const db= require('./data/db');
const bcrypt= require('bcryptjs');
const server= express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Auth-i');
});

///////////////////// Endpoints

server.post('/register', (req, res) => {
    const users=req.body;

    const hash=bcrypt.hashSync(users.password, 14);
    users.password=hash;

    db.insert(users)
    .into('users')
    .then(ids => {
        const id=ids[0];
        res.status(200).json({id, users})
    })
    .catch(error =>{
        res.status(500).json(error)
    })
});

server.get('/users', (req, res) => {
    db('users')
    .then(user=>{
        res.status(200).json(user);
    })
    .catch(error=> res.status(500).json(error));
});









///////////////////// Endpoints

const port = 7700;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});