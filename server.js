const express = require('express');
const cors = require('cors');

const db = require('../data/db');

const port = 3300;
const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Hello!')
  });


//POST REGISTER
  server.post('/api/register', (req, res) => {
    const { name, description } = req.body;
    db
    .insert({ name, description })
    .then(response => {
        res.status(200).json(response)
    })
    .catch(err => {
      res.status(500).json({error: 'The register could not be created'})
    });
  });

  //POST LOGIN
  server.post('/api/login', (req, res) => {
    const { name, description } = req.body;
    db
    .insert({ name, description })
    .then(response => {
        res.status(200).json(response)
    })
    .catch(err => {
      res.status(500).json({error: 'The post could not be created'})
    });
  });

  //GET USERS
  server.get('/api/users', (req, res) => {
    db('users')
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        errorHandler(500, "The user information could not be retrieved.", res);
    });
});



server.listen(port, () => console.log('API running...'))