const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

///endpoints go here

server.get('/', (req, res) => {
    res.send('We runnin....')
  })

  
const port = 3300;
server.listen(port, function() {
 console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
