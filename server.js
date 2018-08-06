const express = require('express');
const cors = require('cors');

const db = require('../data/db');

const port = 3300;
const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Hello!')
  });


//POST REGISTER
  server.post('/api/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;
   
    db('users')
    .insert(user)
    .then(function(ids) {
        db('users')
        .where({ id: ids[0] })
        .first()
        .then(user => {
            res.status(201).json(user)
        })
    })
    .catch(err => {
      res.status(500).json({error: 'The user could not be created'})
    });
  });

  //POST LOGIN
  server.post('/api/login', (req, res) => {
      const login = req.body; 

    db('users')
    .where({ name: login.name })
    .first()
    .then(function(user) {
        const passwords = bcrypt.compareSync(login.password, user.password);
        if(user && passwords) {
            res.send('Success!!');
        } else {
            return res.status(401).json({error: 'Could not Login.'});
        }
    })
    .catch(err => {
      res.status(500).json({error: 'Something went awry.'})
    });
  });

  //GET USERS
  server.get('/api/users', (req, res) => {
    db('users')
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        errorHandler(500, "The user information could not be retrieved.", res);
    });
});



server.listen(port, () => console.log('API running...'))