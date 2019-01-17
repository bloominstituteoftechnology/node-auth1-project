const express = require('express');
const bcrypt = require('bcryptjs')
const db = require('./data/dbConfig');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('This is working');
});

const Port = 3300;

// store a username and password
server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password)
    db('users').insert(user)
    .then(ids => {
      res.status(201).json({id: ids[0]})
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

server.post('/api/login', (req, res) => {
   const user = req.body;
   db('user').where('username' ,user.username)
   .then(users => {
     //username validation, client password validation from db
     if(users.length && bcrypt.compareSync(bodyUser.password, users[0].password, 16)) {
        res.json({ info: "correct"})
     }
     else {
       res.status(404).json({message: "You shall not pass!"})
     }
   })
})

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(Port, () =>
 console.log(`running on port ${Port}`));



