const express = require('express')
const bcrypt = require('bcrypt')
const db = require('knex')(require('./knexfile').development)

const server = express()

server.use(express.json())

server.post('/register', async function (req, res, next) {
  console.log('REQ:', req.body)
  checkBodyCredentials(req, res)
  
  const hash = await bcrypt.hash(req.body.password, 14)
  console.log('HASH:', hash)
   
    db('users')
      .insert({ 
        username: req.body.username, 
        password: hash
      })
      .then(function (ids) {
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


server.post('/login', function (req, res, next) {
  checkBodyCredentials(req, res)

  db('users')
    .where('username', '=', req.body.username)
    .first()
    .then(function (user) {
      bcrypt.compare(req.body.password, user.password, function (err, success) { 
        if (err) {
          next(err)
        }
        
        if (success) {
          res.status(200).send('welcome')
        } else {
          res.status(200).send('invalid password')
        }

      })
    })
    .catch(function (err) {
      next(err)
    })
})


server.use(function (err, req, res, next) {
  res.status(500).json(err)
})

function checkBodyCredentials (req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    res.status(400).send('please provide username and password')
  }
}

server.listen(3456, function () {
  process.stdout.write('magic happening at :3456\n')
})
