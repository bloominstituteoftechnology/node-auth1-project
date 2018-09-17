const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('We are good to go.');
});

server.get('/api/users', (req, res) => {
  db('users')
    // .select('id', 'username')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ errorMsg: 'Could not get users.' }));
});

server.post('/api/register', (req, res) => {
  // grab credentials
  const creds = req.body;
  // hash the password
  const hash = bcrypt.hashSync(creds.password, 10);
  // replace the user password with the hash
  creds.password = hash;
  //save the user
  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err =>
      res.status(500).json({ errorMsg: 'Unable to register user.' })
    );
});

server.post('/api/login', (req, res) => {
    // grab credentials
    const creds = req.body;
    //find the user
    db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
        //check creds
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            res.status(200).json({ message: 'Welcome' });
        }
        else {
            res.status(401).json({ message: 'You shall not pass!' })
        }
    })
    .catch(err => res.status(500).json({errorMsg: 'Could not login.' }))
})

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
