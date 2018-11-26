const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const bcrypt = require('bcryptjs')
const knex = require('knex')

const knexConfig = require('./knexfile.js')
const db = knex(knexConfig.development)

const server = express()

server.use(express.json())
server.use(cors())
server.use(helmet())
server.use(morgan('dev'))

server.post('/api/login', (req, res) => {
  const { username, password } = req.body

  db('users')
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: 'logged in!' })
      } else {
        res.status(401).json({ message: 'log in faild :(' })
      }
    })
    .catch(err => res.status(500).json(err))
})

server.post('/api/register', (req, res) => {
  const { username, password } = req.body

  const hash = bcrypt.hashSync(password, 14)

  db('users')
    .insert({ username, password: hash })
    .then(ids => {
      res.status(201).json(ids)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

server.listen(3300, () => console.log('\nrunning on port 3300\n'))
