const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbHelpers.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Up and running!');
});

// Register a user
server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password);

  db.insert(user)
  .then(id => {
    res.status(201).json({ id: id[0] });
  })
  .catch(err => {
    res.status(500).send(err);
  })
})

server.post('/api/login', (req, res) => {
  const bodyUser = req.body;

  db.findByUserName(bodyUser.username)
  .then(users => {

    // check if username is valed
    // check is password from client === password from db
    // if (users.length && bodyUser.password === users[0].password)
    if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
      res.json({ info: "Logged in" });
    } else {
      res.status(404).json({ err: "You shall not pass!"});
    }
  })
  .catch(err => {
    res.status(500).send(err);
  });
});





server.listen(3300, () => 
  console.log('\nrunning on port 3300\n'));