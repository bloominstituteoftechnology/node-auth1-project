const express = require('express');
const server = express();
const cors = require('cors');

const db = require('./database/dbConfig.js');
const bcrypt = require('bcryptjs');
const session = require('express-session');
//configure express-session middleware
const KnexSessionStore = require('connect-session-knex')(session);
  const sessionConfig = {
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: 'sessions',
      sidfieldname: 'sid',
      knex: db,
      createtable: true,
      clearinterval: 100 * 60 *60,
    })
  };
server.use(session(sessionConfig))




server.use(express.json());

server.use(cors());

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}


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
      req.session.username = user.username;

        res.status(200).send(`Login Accepted ${req.session.username}`);
    } else { 
        res.status(401).json({message: 'Invalid Password/Failed Attempt'})
    }
 })

 .catch(err => res.status(500).send(err));

})

server.get('/setname', (req, res) => {
  // req.session = {};
  req.session.name = 'Frodo';
  res.send('got it');
});

server.get('/greet', (req, res) => {
  // const name = req.session.name;
  const name = req.session.username;
  // res.send(`hello ${req.session.name}`);
  res.send(`hello ${name}`);
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  if(req.session && req.session.username) {
  db('users')
    .select('id', 'username','password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  }
  res.status(401).json({message: "Unauthorized attempt"});

});

server.get('/api/admins', (req, res) => {
  //only see users, if you have the role of 'admin'
  if (req.session && req.session === 'admin') {

 
  db('users')
    .select('id', 'username','password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  // }
} else {
  res.status(403).json({message: "Role violation - No access to resource"});
}
  // res.status(401).json({message: "Unauthorized attempt"});
  // 
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
