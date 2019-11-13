const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');
const Users = require('./api/users/users-model.js.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
  let user = req.body;

// validate the user

// hash the password
const hash = bcrypt.hashSync('password', 12);
// we override the password with the hash
user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/hash', (req, res)=>{
  // read a password from the Authorization header
  const password = req.headers.authorization;

  if(password){

  //that 8 is how we slow down attackers trying to regenerate hashes
 const hash = bcrypt.hashSync('password', 12); //the numberof rounds 2^8
  // a good starting value is 14

  res.status(200).json({ hash });

  
  // return an object with the password hashed using bcrypt.js
  // {hash:'97845565954}
}else{
  res.status(400).json({message : 'please provide credentials'});
}
});

const port = process.env.PORT || 6000;
server.listen(port, () => console.log(`\n** Running in the ${port} with my woes **\n`));
