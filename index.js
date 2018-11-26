const express = require('express');
const helmet = require('helmet');
const bcrypt = require ('bcryptjs');


const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req,res) => {
    res.send('I Am Alive!');
})

server.post('/register', (req, res) => {
    const credentials = req.body;
    // hash the password
    const hash = bcrypt.hashSync(credentials.password, 14) // 2^14 times
    credentials.password= hash;
    // save user
    db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id})
    })
    .catch(err => {
      res.status(500).json(err)
    })
  
  })

server.listen(3700, () => console.log('\n Party at part 3700 '))
