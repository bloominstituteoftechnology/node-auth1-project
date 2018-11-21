const express = require('express')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const knexConfig = require('./knexfile.js')
const cors = require('cors')
const db = knex(knexConfig.development)
const server = express();
server.use(express.json())
server.use(cors())

server.get('/', (req, res) => {
    res.send('im running')
})

server.post('/api/register', (req, res) => {
    const credentials = req.body

    const hash = bcrypt.hashSync(credentials.password, 14)
    credentials.password = hash;

    db('users')
        .insert(credentials)
        .then(ids => {
            const id = ids[0]
            res.status(201).json({ userId: id })
        })
        .catch(err => {
            res.status(500).json({ message: 'Error registering to the server' })
        })
})

server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

server.listen(9000, () => console.log('server is running'))