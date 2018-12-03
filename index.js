const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(cors());

//ENDPOINTS

//login
server.post('/login', (req,res) => {
  //grab username and password from body
  const credentials = req.body;

  db('users')
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(credentials.password, user.password)) { //see COMPARESYNC
        //passwords match and user exists by that username
        res.status(200).json({message: 'you made it!'})
      } else {
        //either username or password is valid, all returns failure
        res.status(401).json({message: 'incorrect inputs'})
      }
    })
    .catch(err => res.json(err))
})

//registration
server.post('/register', (req,res) => {
  //grab uname and pass
  const credentials = req.body;

  //hash the pass
  const hash = bcrypt.hashSync(credentials.password, 4);

  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      db('users')
      .where({ id: ids[0]})
      .first()
      .then(user => {
        res.status(201).json(user);
      })
    })
    .catch(err => res.status(500).json(err))
})

server.get('/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});


//SERVER and SERVER RUNNING
server.get('/', (req, res) => {
  res.json({ api: 'server 7700 up and running!' });
});

server.listen(7700, () => console.log('\n== Port 7700 ==\n'));