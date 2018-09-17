const express = require('express');
const cors = require('cors');

const db = require('./database/dbConfig.js');
const bcrypt = require('bcryptjs');
const server = express();


server.use(express.json());

server.use(cors());


server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/api/register', (req,res) =>{
  //grab credentials
  const creds = req.body
  //hash the password
  const hash = bcrypt.hashSync(creds.password, 3); //really 2^3, hashed 8 times

  //replace user password with the hash
  creds.password = hash;
  //save the user

  db('users').insert(creds).then(ids => {

    const id = ids[0];
  res.status(201).json(id);

  }).catch(err => res.status(500).send(err));
  //save the usersreurn 201

});

server.post('/api/login', (req,res) =>{
  const creds = req.body;

  db('users')
    .where({username: creds.username })//where always returns an array
    .first()                            //aska for the first item in the array
    .then(user => {

//check creds
    if(user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send('Login Accepted');
    } else { 
        res.status(401).json({message: 'Invalid Password/Failed Attempt'})
    }
 })

 .catch(err => res.status(500).send(err));

})

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username','password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
