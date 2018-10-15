const express = require('express');

const cors = require('cors');

const db = require('./database/dbConfig.js');

const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Werk Werk');
});

server.post('/register', (req, res) => {
  const credentials = req.body; 

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users').insert(credentials).then(ids => {
    const id = ids[0];
    res.status(201).json({ newUserId: id})
  })
   .catch(err => {
     res.status(500).json(err);
   });
});

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users').where({username: creds.username}).first().then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      res.status(200).json({welcome: user.username})
    }
    else {
      res.status(401).json({message: 'You just cannot enter. That is all.'})
    }
  })
  .catch(err => req.status(500).json({ message: 'Something went wrong'}));

})

// protect this route, only authenticated users should see it
server.get('/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log('\nrunning on port 7700\n'));
