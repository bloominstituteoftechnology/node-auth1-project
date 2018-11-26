const express = require('express');

const db = require('./database/dbConfig');

const server = express();
const port = 8080;

// middleware
server.use(express.json());

// test api
server.get('/', (_, res) => res.send('API is running...'));

// ===================== ENDPOINTS =====================
// retrieve users
server.get('/api/users', (_, res) => {
  db('users')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
