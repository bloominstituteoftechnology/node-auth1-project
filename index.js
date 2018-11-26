// Imports
const express = require('express');
const config = require('./middleware/config.js');

// Initializes the server
const server = express();
// Middleware
config(server);

// Endpoints
server.get('/', (req, res) => {
  res.json('alive');
});

// Sets server to listen on port 8000
server.listen(8000, () => console.log('==== Listening on port 8000 ===='));
