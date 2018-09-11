const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const session = require('express-session')

const db = require('./database/dbConfig.js');

const server = express();

server.use(
  session({
    name: 'whatever', // default is connect.sid
    secret: 'shhh!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, 
    }, 
    httpOnly: false, 
    resave: false,
    saveUninitialized: false,
  })
);

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/register', (req, res) =>{
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10)
  creds.password = hash;
  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0]
      res.status(201).json(id)
    }).catch(err=> res.status(500).send(err))
})

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({username: creds.username})
    .first()
    .then(user =>{
      if (user && bcrypt.compareSync(creds.password, user.password)){
        req.session.username = user.username;
        res.status(200).send(`welcome ${req.session.username}`)
      } else {
        res.status(401).json({message: 'The username or password incorrect.'})
      }
    })
})

server.get('/setname', (req, res) => {
  req.session.name = 'Frodo';
  res.send('got it');
});

server.get('/greet', (req, res) => {
  const name = req.session.username;
  res.send(`hello ${name}`);
});

// protect this route, only authenticated users should see it
server.get('/users', (req, res) => {
  if(req.session && req.session.username){
    db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  }  
  res.status(401).json({message: 'You are not authorized'})
});

server.get('/admins', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
server.listen(3300, () => console.log('\nrunning on port 3300\n'));
