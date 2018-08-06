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


server.post('/login', (req, res) => {
  let {username, password} = req.body

  //Get existing password from db from username
  db('user').where({username}).select('password')
    .then(data => {

      //Synchronous Way:
      //If the passwords don't match:
      if(!bcrypt.compareSync(password,data[0].password)) res.status(500).json({err: 'Credentials are not valid, please try again'})
      
      //If they do, welcome them
      else res.status(200).send('Welcome back!')
    })
    .catch(err => res.status(500).json(err))
})



server.listen(3000, () => {console.log('\n==== Server Running on port 3000! ====\n')})