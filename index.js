const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs'); // 
const db = require('./database/dbConfig.js');

const server = express();
server.use(express.json());
server.use(cors());


server.post('/api/register', (req,res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users')
    .insert(creds)
    .then(ids => {
        res.status(201).json(ids)
    })
    .catch(error => res.status(500).json({message: '***Error making user***', error}) )
})


server.get('/api/users', (req, res) => {
    db('users')
    .select('id','username','password')
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => res.status(500).json(error))
})

server.get('/', (req, res) => {
    res.send('Its Alive!');
  });
  
server.listen(8000, () => console.log('\nrunning on port 8000\n'));