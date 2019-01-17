const express = require('express');
//const cors = require('cors');
const bcrypt = require('bcryptjs')
const db = require('./database/dbConfig.js');
//import bcrypt from 'bcryptjs';
const server = express();

server.use(express.json());
//server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
  const user = req.body;
  console.log("user.password:", user.password)
// let password = user.password;
//  user.password = bcrypt.hash(password, 8, function(err, hash) {
//});
console.log("user:", user)
 user.password = bcrypt.hashSync(user.password);
  console.log("user:", user)
 // const hash = bcrypt.hashSync(user.password, 'my salt');
 // user.password = hash;
 // db.insert('user')
 db.insert(user)
//db('users').insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] })
    })
    .catch(err => {
      res.status(500).send(err);
    })

})

server.post('/api/login', (req, res) => {
// check that username exists and that passwords match
  const bodyUser = req.body;
  console.log("bodyUser:", bodyUser)
 // db('users').where('username', bodyUser.username)
  db.findByUsername(bodyUser.username)
  .then(users => {
    //user name valid password from client == password from db
    if (users.length && bcrypt.compareSync(bodyUser.password === users[0].password)) {
      res.json({ info: "correct"});

    } else {
      res.status(404).json({err: "invalid username or password"})
    }
  })

})

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
