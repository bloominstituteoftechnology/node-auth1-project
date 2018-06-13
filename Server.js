const express = require('express')
const server = express()
const mongoose = require('mongoose')
const User = require('./User')

mongoose.connect('mongodb://localhost/auth-i')
  .then(() => {
    console.log('\n === Database Connected ===\n')
    server.listen(5000, () => {
      console.log('\n === Server Listening on Port 5000 === \n')
    })
  })
  .catch(err => console.log(err))

const wakeUp = (req, res, next) => {
  req.message = 'Good morning GD and JC...'
  next()
}

server.use(express.json())
server.use(wakeUp)
server.get('/', (req, res) => {
  res.status(200).json({msg: 'Connected to server'})
})

server.post('/api/register', (req, res) => {
  const user = new User(req.body)
  user.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).send(err))
})
<<<<<<< HEAD
=======

>>>>>>> 360402e1f7b1d6cd6d84c709b10b967f3bbfaddc
