const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('./data/db')
const session = require('express-session')

const server = express()

server.use(express.json())

server.use(
  session({
    name:'nothinghere',
    secret: 'nobody tosses a dwarf',
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    httpOnly: true,
    secure: false,
    resave:false,
    saveUninitialized:false,
  })
)

//Middleware to check if a user is logged in
const isSessionValidGate = (req, res, next) => {
  !req.session.username ? res.status(500).json({err: 'Please login to access this resource'}) : next();
}



server.get('/', (req, res) => {
  res.status(200).send('Alive and well')
})


server.post('/api/register', (req, res) => {
  let {username, password} = req.body
  
  //Synchronous Way:
  //Hash password
  password = bcrypt.hashSync(password,10)

  //Insert Password
  db('user').insert({username,password})
    .then(data =>{
      console.log(data)
      if (data[0] > 0) {
        //Set the session for this user
        req.session.username = username
        console.log(req.session)

        //Send this will send the session as well
        res.status(200).json({msg:"user registered"})

      }else {
        res.status(500).json({msg:"user NOT registered"})
      } 
    })
    .catch(err => res.status(500).json({err}))
})


server.post('/api/login', (req, res) => {
  //If the session exists, then just route them in
  console.log(req.session.username)
  if(req.session.username) res.status(200).send('Welcome back!')
  
  //Else, the session must have expired?, then validate the username & password
  else {
    console.log('did not skip re-authentication')
    let {username, password} = req.body
    
    //Get existing password from db from username
    db('user').where({username}).select('password')
    .then(data => {
      
      //If the passwords don't match:
      if(!bcrypt.compareSync(password,data[0].password)) res.status(500).json({err: 'Credentials are not valid, please try again'})
      
      //If they do, welcome them
      else {
        
        //Create the session
        req.session.username = username
        console.log(req.session)
        
        res.status(200).send('Welcome back!')
      }
    })
    .catch(err => res.status(500).json(err))
  }
})


server.get('/api/users', isSessionValidGate, (req,res) => {
  db('user')
    .then(data => {
      res.status(200).json(data)
    })
})

server.listen(3000, () => {console.log('\n==== Server Running on port 3000! ====\n')})