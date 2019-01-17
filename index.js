const express = require('express');
const server = express()
const cors = require('cors')
const db = require('./database/dbHelpers.js')
const bcrypt = require('bcryptjs');
server.use(express.json());
server.use(cors());


// basic get request to test if server is up 

server.get('/', (req, res) => {
  res.send("It's alive");
});

//this route should be protected, only authenticated users should be able to see it
server.get('/api/users', (req, res) => {
    db.getUsers()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 16) // 16 denotes how many times its hashes
  db.insertUser(user)
    .then(id => {
      res.status(201).json({ id: id[0] })
    })
    .catch(err => {
      res.status(500).json({ error: 'Please Try Again' })
    });
});

server.post('/api/login', (req, res) => {
  const bodyUser = req.body;
  db.findByUsername(bodyUser.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
        res.json({ info: 'Success' })
      } else {
        res.status(404).json({ err: 'invalid password or username' })
      }
    })
    .catch(err => {
      res.status(404).json(err)
    });
})


server.listen(3300, () => console.log('\nrunning on port 3300\n'));