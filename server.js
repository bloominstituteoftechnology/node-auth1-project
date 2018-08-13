const express = require ('express');
const db= require('./data/db');
const server= express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Auth-i');
});

///////////////////// Endpoints

server.post('/register', (req, res) => {

});









///////////////////// Endpoints

const port = 7700;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});