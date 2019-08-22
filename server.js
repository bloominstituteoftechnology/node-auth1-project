const express = require('express');
const helmet = require('helmet');

const server = express();

server.use(express.json());
server.use(helmet());

// ROUTES
server.get('/api/users', (req, res) => {
  
})

server.post('/', (req, res) => {

})

server.post('/', (req, res) => {

})

// FALLBACK
server.use('/', (req, res) => {
  res.send('<p>User Auth Server</p>');
})

module.exports = server;