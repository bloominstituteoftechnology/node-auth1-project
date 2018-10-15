const bcrypt = require('bcryptjs');
const express = require('express');
const helmet = require('helmet');

const db = require('./data/dbConfig.js');

const port = 5000;
const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
    res.send('Am I Alive?'); //Yes
});

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users')
        .insert(credentials)
        .then(ids => {
            const id = ids[0];
            res.status(201).json({newUserId: id});
        })
        .catch(err => res.status(500).json(err))
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).json({message: `Logged in ${user}`})
            }else {
                res.status(401).json({message: 'You Shall Not Pass!'})
            }
        })
        .catch(err => res.status(500).json(err))
});

server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  

server.listen(port, () => console.log(`\n=== Listening on Port ${port} ===\n`));


