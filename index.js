const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const db = require('./database/databaseConfig.js');

const server = express();

const sessionConfig={
  secret:'ClarissA123123!',
  name:'Fox',
  httpOnly:true,
  resave:false,
  saveUninitialized:false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1,
  }
}
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
    res.send('Page Down for security Testing!');
  });
  
  server.post('/register', (req, res) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
      .insert(credentials)
      .then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
  
  server.post('/login', (req, res) => {
    const creds = req.body;
  
    db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          req.session.username = user.username;
          res.status(200).json({ welcome: user.username });
        } else {
          res.status(401).json({
            message: `Sorry You Are Not Authenticated, Please Try Again.`,
          });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
  
  server.get('/api/users',protected, (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  function protected(req, res, next){
    if (req.session && req.session.username){
      next();
    } else {
      res.status(401).json({message:'NOT AUTHORIZED!!!'});
    }
  }
  
  server.listen(3300, () => console.log('\nrunning on port 3300\n'))