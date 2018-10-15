const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // added this library

const db = require('./dbConfig.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());



server.get('/', (req, res) => {
  res.send('This sshizz working?');
});

//################################### POST ########################################//
// implented this here
//Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:02)
server.post('/register', (req, res) => {
  const creds = req.body;
  // hash the password here
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;
  // then save the user

  db('users')
  .insert(creds)
  .then(ids => {
      const id = ids[0];

      res.status(201).json(id);
  })
  .catch(err => {
      res.status(500).send(err);   
  })
});

server.post('/api/login', (req ,res) => {
  const creds = req.body;

  db('users')
  .where({username: creds.username})
  .first()
  .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
          res.send(200).send('Started from the bottom now you here!');
      } else {
          res.status(401).json({ message: `That's wrong dude....`});
      }
  })
  .catch(err => res.status(500).send(err))

});


//################################### GET ########################################//
// Protect this route, only authneticated users should see this
//Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:03)
server.get('/users', (req, res) => {
  db('users')
  // added the password field in just to see if it was hashed
  .select('id', 'username', 'password')
  .then(users => {
      res.json(users);
  })
  .catch(err => res.send(err));
});

const port = 9001;
server.listen(port, () => console.log(`******* Running on power level ${port} *******`));