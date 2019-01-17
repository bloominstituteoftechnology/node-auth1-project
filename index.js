const express = require('express');
const server = express(); 
const bcrypt = require('bcryptjs')
const db = require('./database/helpers.js'); 
const PORT = 7654


server.use(express.json()); 

server.get('/', (req, res) => {
    res.send('database is operating')
})

server.get('/api/users', (req, res) => {
  db('users').select('id', 'username')
    .then( user => {
        res.status(200).json(user)
    })
    .catch( error => { res.status(400).json({error: "there was an error"})
  })
})


server.listen(PORT, () => { console.log('Server is running on port' + PORT)})