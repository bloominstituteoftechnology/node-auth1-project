const express = require('express');
const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');

const User = require('./auth/UserModel.js');

mongoose.connect('mongodb://localhost/authweek').then(() => {
  console.log(`\n *** Connected to database *** \n`)
})


const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ api: 'running....'});
});

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
  let hashPassword;
 
  User.find({username: username})
    .then(user => {
      bcrpyt.compare(password, user[0].password, function(err, res2) {
        if(err){
          return res.status(500).json(err)
        }
        if(res2){
          res.json('login')
        }else {
          res.json("not logged in") 
        }
      })
      
      
      // bcrpyt.hash(password, 12, (err, hash) => {
      //   if(err) {
      //     return res.status(500)
      //   }
        
      //   console.log(hash)
      //   if(user[0].password === hash){
      //     console.log("login")
      //   }else {
      //   console.log('not logged in', hash, user[0].password)
      //   res.json(user)
      //   }
        
      // })
      
    })
})


server.listen(8000, () => { 
  console.log(`\n *** API running on port 8k*** \n`)
});