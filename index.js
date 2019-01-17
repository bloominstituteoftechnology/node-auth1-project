const express = require('express');
const cors = require('cors');;
const db = require('./database/dbHelpers');
const server = express();
const bcrypt = require('bcryptjs');
server.use(express.json());
server.use(cors());



server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/api/register', (req, res) => {
  const user =  req.body;
  user.password = bcrypt.hashSync(user.password);
  db.insertUser(user)
  .then(ids => {
    res.status(201).json({id: ids[0]})
  })
  .catch(err => {
    res.status(500).send(err)
  })
})

server.post('/api/login', (req, res) => {
  //check that username AND passwords match
  const bodyUser = req.body;
  db.findByUsername(bodyUser.username)
    .then(users => {
      if(users.length && bcrypt.compareSync(bodyUser.password, users[0].password)){
        res.json({ info: "correct" })
      } else {
        res.status(404).json({ error: 'Invalid username or password' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
    ;
 })

server.get('/api/users', (req, res) => {
  db.getUser()
    .select('id', 'firstname', 'lastname')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});





server.listen(3300, () => console.log('\nrunning on port 3300\n'));
