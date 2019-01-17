const express = require('express');
const server = express(); 
const bcrypt = require('bcryptjs')
const db = require('./database/helpers.js'); 
const PORT = 7654


server.use(express.json()); 

server.get('/users', (req, res) => {
    res.send('database is operating')
})

server.listen(PORT, () => { console.log('Server is running on port' + PORT)})