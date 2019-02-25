const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile')
const bcrypt = require('bcryptjs');
const db = knex(knexConfig.development);
const Users = require('./users/users-model.js');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.send("It's alive!");
  });

server.post('/api/register', (req, res) => {
    let user = req.body;
    // generate hash from user's password
    const hash = bcrypt.hashSync(user.password, 12); // 2^ n
    // override user.password with hash
    user.password = hash 
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
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
function restricted (req, res, next) {
    const { username, password } = req.headers;
  
    if (username && password){
    Users.findBy({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          next()
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json({message: 'Ran into an unexpected Error'});
      });
    }
      else{
        res.status(500).json({message: 'No credentials provided'});
      }
}
server.get('/api/users', restricted, (req, res) => {
    const user = req.headers
    // if user has right credentials proceed 
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

const port = process.env.PORT || 5000;
server.listen(port, ()=> console.log(`\n Running on ${port}\n`))
