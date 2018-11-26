const express = require('express');
const helmet = require('helmet');
const bcrypt = require ('bcryptjs');
const session = require('express-session')

const db = require('./data/dbConfig.js')

const server = express();

const sessionConfig = {
    secret: 'anong.balita.sa.radyo.at.tv.',
    name: 'monkey',// defaults to connect.sid
    httpOnly: true, // no JS access
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,// restrict so a cookie is only saved when it is secured - https : put true. but we use false to test
        maxAge: 1000 * 60 * 10 // 10 minutes, when it expires. hey, your session expired! -- this is it
    },
}

server.use(session(sessionConfig));
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
      req.session.username = credentials.username // save that session, i want to put a username in that session
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
        req.session.username = user.username // save that session, i want to put a username in that session
        res.status(200).json({ welcome: user.username})
  
      } else {
        res.status(404).json({ message: 'You shall not pass!'})
      }
    })
    .catch(err => res.status(500).json(err))
  })

 // protect this route, only authenticated users should see it
 server.get('/api/users', protected, (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).send('Not authorized!')
    }}

server.listen(3700, () => console.log('\n Party at part 3700 '))
