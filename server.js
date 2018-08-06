const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('./data/db')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
  res.status(200).send('Alive and well')
})


server.post('/register', (req, res) => {
  let {username, password} = req.body
  console.log(username)
  console.log(password)
  
  //Synchronous Way:
  //Hash password
  password = bcrypt.hashSync(password,14)

  //Insert Password
  db('user').insert({username,password})
    .then(data =>{
      data.length > 1 ? res.status(200).json({msg:"user registered"}) : res.status(500).json({msg:"user NOT registered"})
    })
    .catch(err => res.status(500).json({err}))
})

server.listen(3000, () => {console.log('\n==== Server Running on port 3000! ====\n')})