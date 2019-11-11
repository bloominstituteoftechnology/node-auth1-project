const express = require('express');
const helmet = require('helmet')

server.use(express.json());
server.use(helmet());


const users = require('../routes/users-router')
server.use('/api/users', users);

const authorize = require('../routes/auth-router')
server.use('/api/auth', authorize);

server.get('/', (req,res) => {
    res.send(`
      <h2>Lambda Web Auth I</h>
    `);
})

module.exports = server;