const express = require('express');

const db = require('./data/db.js');

const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());

///endpoints go here

server.get('/', (req, res) => {
    db('users')
        .then(proj => res.status(200).json(proj))
        .catch(err => res.status(500).json({error:'These are not the projects you are looking for'})
    )
})

server.post('/api/register', (req, res) => {
    const register = req.body;
    const hash = bcrypt.hashSync(register.password, 14);
    register.password = hash;
    if (!register.username || !register.password)
    res.status(400).json({errorMessage:"Required username and password"});
    db('users')
        .insert(register)
        .then(user => res.status(201).json(register))
        .catch(err => res.status(400).json({error: 'Error posting'}))
})

const port = 3300;
server.listen(port, function() {
 console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
