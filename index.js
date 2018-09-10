const express = require('express');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('API running ...')
})

const port = 3500;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});