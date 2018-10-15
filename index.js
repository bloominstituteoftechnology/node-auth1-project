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
  const credentials = req.body;
  // hash the password here
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  // then save the user

  db('users')
  .insert(credentials)
  .then(ids => {
      const id = ids[0];

      res.status(201).json(id);
  })
  .catch(err => {
      res.status(500).send(err);   
  })
});
//Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:22)
// Always send as a post because you don't wanna send login information as part of the URL becuase people can see that
server.post('/login', (req ,res) => {
  const credentials = req.body;

  db('users')
  .where({username: credentials.username})
  .first()
  .then(user => {
    //Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:18)
    // (near 1:24) CompareSync is comparing the 2 password the user sent to he hash password in the database
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
          res.status(200).json(`Started from the bottom now you here ${user.username}!`);
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
  // added the password field in just to see if it was hashed...don't forget to takeout lol
  .select('id', 'username')
  .then(users => {
      res.json(users);
  })
  .catch(err => res.send(err));
});

const port = 9001;
server.listen(port, () => console.log(`******* Running on power level ${port} *******`));

// NEVER STORE PLAIN-TEXT Passwords