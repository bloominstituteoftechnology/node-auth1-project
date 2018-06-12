const express = require('express');
const mongoose = require('mongoose');
// const bcrpyt = require('bcrypt');
const session = require('express-session')
const cors = require('cors');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/authweek').then(() => {
  console.log(`\n *** Connected to database *** \n`)
})


const server = express();


const sessionConfig = {
  secret: "this is something",
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000},
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname' //hides name in cookie
}

server.use(cors(
  // {credentials: true}
));
server.use(express.json());
server.use(session(sessionConfig))

function protected(req, res, next) {
  if(req.session && req.session.username) {
    next();
  }else{
    res.status(401).json({message: 'you shale not pass'})
  }
}

server.get('/', (req, res) => {
  if(req.session && req.session.username){
    res.status(200).json({ api: `welcome back ${req.session.username}`})
  } else{
    res.status(401).json({message: 'who are you?'})
  }
  ;
});

server.get('/greet', (req, res) => {
  const name = req.session
  res.json(name)
})

server.post('/api/register', (req, res) => {

  // save the user to the database
  console.log(req.body)
  User.create(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.post('/api/login', (req, res) => {
  const {username, password } = req.body;


  User.findOne({username})
    .then(user => {
      if(!user){
        res.status(401).json('brah, you aint gettin in');
      }
      else{
        user.pwCheck(password)
        .then(isValid => {
          if(isValid){
            req.session.username = user.username;
            res.json('Logged In') //why are we getting back id and password
          }
          else{
            res.status(401).json('You shall not pass')
          }
        })
        .catch(err => {
          res.status(500).json("login error",err)

        })
      }

    })
    .catch(err =>{
      res.status(500).json(err.message)
      console.log(err)
    })
})

server.get('/api/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(err  => {
      if (err){
        res.json('error logging out')
      } else {
        res.json('goodbye')
      }

    })
  }
})

server.get('/api/users', protected, (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
})

server.listen(8000, () => {
  console.log(`\n *** API running on port 8k*** \n`)
});
