const express = require('express')
const helmet = require('helmet')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const knex = require('knex')
const knexConfig = require('./knexfile.js')
const db = knex(knexConfig.development)
const port = 9000
const server = express()

server.use(express.json())
server.use(helmet())
server.use(cors())

server.route('/')
  .get((req, res) => res.send("En vivo"))

server.route('/register')
  .post((req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
      .insert(credentials)
      .then(ids => {
        const id = ids[0]
        res.status(201).json({ newUserId: id });
      })
      .catch(err => res.status(500).json(err));
  })

server.listen(port, () => console.log(`\n===Listening on ${port}===\n`))