const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');

const server = express();
const port = 9000;

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('<h1>Its Alive!<h1>');
});

server.post('/register', (req, res) => {
  const credentials = req.body;
  
  // HASH PASSWORD
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  // THEN SAVE USER
  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id})
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
        // FOUND USER
        res.status(200).json({ welcome: user.username})
      } else {
        // USER NOT FOUND
      res.status(401).json({ message: 'you shall not pass!'})
    }
  })
  .catch(err => {
    res.status(500).json({ err });
  });
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(port, function() {
    console.log(`\n API RUNNING ON PORT ${port} \n`);
  });
