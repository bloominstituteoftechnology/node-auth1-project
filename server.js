const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userController = require('./user/userController')

const server = express()

server.use(express.json())
server.use(cors())

mongoose.connect('mongodb://localhost/adfarisUser').then(() => {
  console.log('Connected to Mongo')
})

server.use('/api/register', userController)
// server.user('/api/login', loginController)

server.get('/', (req, res) => res.status(200).json({ api: 'running....' }))

server.listen(8500, () => {
  console.log('\n API running on port 8.5K\n')
})
