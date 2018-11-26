const express = require('express');
const bcrypt = require('bcryptjs');
const port = 3334;

const db = require('./config/dbConfig');
const middleware = require('./config/middleware')
const server = express();

middleware(server);

server.get('/', (req,res) =>{
    res.send('<h1>Built by Ryan Clausen</h1>')
})

server.listen(port, ()=> console.log(`We hear you ${port}`))