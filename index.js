const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

//Add POST user and password with hash password

server.post('/api/register', (req, res) =>{
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;
  Users.add(user)
  .then(saved => {
    res.status(201).json(saved);
  })
  .catch(err => {
    res.status(500).json({err: 'Something went wrong!'})
  });

});

//Add POST login  function 

server.post('/api/login', (req, res)=>{

  let {username, password } = req.body;
  Users.findBy({username})
  .first()
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)){
      res.status(200).json({ message: `${user.username} is logged in!` });
    }else{
      res.status(401).json({ message: 'You shall not pass!' });
    }
  })
.catch(err=>{
  res.status(500).json({err: 'You shall not pass!'})
})
});

//Middleware 

function restricted(req, res, next){ 
  const {username, password } = req.headers;
  if (username && password) {
      Users.findBy({username})
      .first()
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
          next();
  
        }else{
      res.status(401).json({message:'You shall not pass'})
  
        }
      })
      .catch(err =>{
        res.status(500).json(err);
      })
     }else{
  res.status(400).json({message:'You shall not pass'})
      }
  };
  
  server.get('/api/users', restricted, (req, res) => {

    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });


const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));