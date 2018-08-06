const express = require('express')
const bcrypt = require('bcrypt')
const db = require('knex')(require('./knexfile').development)

const server = express()
server.use(express.json())

server.post('/register', function (req, res, next) {
  if (!req.body || !req.body.username || !req.body.password) {
    res.status(400).send('please provide username and password')
  }
  bcrypt.hash(req.body.password, 14, function (err, hash) {
    console.log('hash:', hash)
   
    if (err) {
      next(err)
    }
  
    db('users')
      .insert({ 
        username: req.body.username, 
        password: hash
      })
      .then(function (ids) {
        console.log('inserted user to db')
        res.status(200).json({
          id: ids[0],
          username: req.body.username,
        password: hash
        })
      })
      .catch(function (err) {
        next(err)
      })
  }) 
})

server.use(function (err, req, res, next) {
  res.status(500).json(err)
})

server.listen(3456, function () {
  process.stdout.write('magic happening at :3456\n')
})
