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

server.route('/api/register')
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

server.route('/api/login')
  .post((req, res) => {
    const credentials = req.body
    db('users')
      .where({ username: credentials.username }).first()
      .then(user => {
        if (user && bcrypt.compareSync(credentials.password, user.password)) return res.status(200).json({ message: `Welcome ${user.username}!` })
        return res.status(401).json({ message: 'You shall not pass!' });
      })
      .catch(err => res.status(500).json({ err }));
  })  

server.route('/api/users')
  .get((req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => res.json(users))
      .catch(err => res.send(err));
  });

server.listen(port, () => console.log(`\n===Listening on ${port}===\n`))