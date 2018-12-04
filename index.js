const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs'); 
const db = require('./data/dbConfig.js');

const server = express();

const sessionConfig = {
    secret: 'this is my secret',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
}

server.use(session(sessionConfig))
server.use(express.json());
server.use(cors());

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
          if (user && bcrypt.compareSync(creds.password, user.password)) {
              req.session.userId = user.id;
            res.status(200).json({ message: 'Welcome my friend!' });
          } else {
            res.status(401).json({ message: 'You are going NOWHERE!!' });
          }
        })
        .catch(err => res.json(err));
    });

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 4); 
    creds.password = hash;
  
    db('users')
      .insert(creds)
      .then(ids => {
        res.status(201).json(ids);
      })
      .catch(err => json(err));
  });


server.get('/api/users', (req, res) => {
  if (req.session && req.session.userId) { 
      db('users')
      .select('id', 'username', 'password')
      .then(users => {
          res.json(users);
        })
        .catch(err => res.send(err));
} else {
    res.status(401).json({messege: 'Stop in the name of Love'})
}
  });

server.get('/', (req, res) => {
    res.send('Its Alive!');
  });

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
