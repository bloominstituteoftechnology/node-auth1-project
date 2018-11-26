const express = require('express');
const helmet = require('helmet');
const bcrypt = require ('bcryptjs');

const db = require('./data/dbConfig.js')

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req,res) => {
    res.send('I Am Alive!');
})

server.post('/api/register', (req, res) => {
    const credentials = req.body; // store body of post req un credentials var
    // hash the password
    const hash = bcrypt.hashSync(credentials.password, 14) // 2^14 times, hash the pw
    credentials.password= hash; // store hashed pw on credentials
    // save user
    db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
    //   req.session.username = credentials.username // save that session, i want to put a username in that session
      res.status(201).json({ newUserId: id})
    })
    .catch(err => {
      res.status(500).json({ message: 'Err'})
    })
  })

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
    .where({ username: creds.username})
    .first()
    .then(user => {
      // found user - right password or not (compare sync) -- compare to user password (hash same, found)
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ welcome: user.username})
  
      } else {
        res.status(404).json({ message: 'You shall not pass!'})
      }
    })
    .catch(err => res.status(500).json(err))
  })

 // protect this route, only authenticated users should see it
 server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

server.listen(3700, () => console.log('\n Party at part 3700 '))
