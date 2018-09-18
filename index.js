const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Server is humming along nicely.');
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// login
server.post('/api/login', (req, res) => {
    // grad creds
    const creds = req.body;
    // find the user
    db('users').where({username: creds.username}).first().then(user => {
    // check creds
    if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send('Welcome')
    } else {
        res.status(401).json({ message: 'You shall not pass!'})
    }
    }).catch(err => res.status(500).send(err))

    // check creds
})

// register
server.post('/api/register', (req, res) => {
    // grab the credentials
    const creds = req.body;
    //hash the password
    const hash = bcrypt.hashSync(creds.password, 3)
    //replace the user passsword with the hash
    creds.password = hash
    // save the user
    db('users').insert(creds).then(ids => {
        const id = ids[0];
        
        res.status(201).json(id)
    }).catch(err => res.status(500).send(err))
    // return 201
})

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
