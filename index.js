const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile')
const bcrypt = require('bcryptjs');
const db = knex(knexConfig.development);
const Users = require('./users/users-model.js');
const session = require('express-session'); //Require sessions
const KnexSessionStore = require('connect-session-knex')(session);
const server = express();


const sessionConfig = {
  name: 'Billy Shakespeare', //Name of your cookies to hide from "hackers"
  secret: 'To Be or Not to Be', //Secret should be stored in .env come production
  cookie:{
    maxAge: 1000 * 60 * 30, // in ms
    secure: false //used over https only
  },
  httpOnly: true, //cannot acces the cookie from hs using document.cookie
  resave: false,
  saveUninitialized: false, //GDPR laws against setting cookies automatically
  
  store: new KnexSessionStore({
    knex: db,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60, // in ms

  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
    res.send("It's alive!");
  });

server.post('/api/register', (req, res) => {
    let user = req.body;
    // generate hash from user's password
    const hash = bcrypt.hashSync(user.password, 12); // 2^ n
    // override user.password with hash
    user.password = hash 
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    Users.findBy({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          // Save information about user for sessions
          req.session.username = user.username;
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });



  function restricted (req, res, next) {
    if (req.session && req.session.username){
      next()
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
}
  
server.get('/api/users', restricted, (req, res) => {
    const user = req.headers
    // if user has right credentials proceed 
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  server.get('/api/logout', (req, res) => {
    if(req.session){
      req.session.destroy(err=>{
        if (err) {
          res.send("You're trapped!")
        } else {
          res.send('bye, thanks for playing')
        }
      })
    } else{
      res.end()
    }
  });
const port = process.env.PORT || 5000;
server.listen(port, ()=> console.log(`\n Running on ${port}\n`))
