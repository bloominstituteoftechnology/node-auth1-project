console.log('index.js says hi....hi!');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); //bring in the bcryptjs

const db = require('./data/dbConfiguration.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/register', (req, res) => { 
  const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users').insert(credentials).then(ids => {
    const id = ids[0];
    res.status(201).json({ newUserId: id })
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

server.post('/login', (req, res) => {
  const credentials = req.body;
  db('users').where({username: credentials.username}).first().then(user => {
//compareSync is how we figure that out, compares the given password and the actual pasword
if(user && bcrypt.compareSync(credentials.password, user.password)) {
  res.status(200).json({ welcome: user.username })
    } else {
      res.status(401).json({ message: "Entry Denied!" })
    }
  })
  .catch(err => res.status(500).json({ err }));
});

server.get('/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')// we normally wouldn't have it return the password
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(9000, () => console.log('\n API running mad circles on port 9000\n'));
