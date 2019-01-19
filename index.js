const express = require('express');
const cors = require('cors');;
const db = require('./database/dbHelpers');
const server = express();
const bcrypt = require('bcryptjs');
const session = require('express-session');

server.use(express.json());
server.use(cors());

server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!', //this allows us to encrypt or unencrypt. we wouldn't want this to be hard coded or a string.
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, //the age of our cookie
  }, // this is 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false, //forces the session to be saved back to the session store, even if the session wasn't modified during the request
  saveUninitialized: false, //do we want to make people give their consent for cookies? thing EU's GDPR laws
 }))

 

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/api/register', (req, res) => {
  const user =  req.body;
  console.log('session', req.session)
  user.password = bcrypt.hashSync(user.password);
  db.insertUser(user)
  .then(ids => {
    res.status(201).json({id: ids[0]})
  })
  .catch(err => {
    res.status(500).send(err)
  })
});

server.post('/api/login', (req, res) => {
  //check that username AND passwords match
  const bodyUser = req.body;
  db.findByUsername(bodyUser.email)
    .then(users => {
      if(users.length && bcrypt.compareSync(bodyUser.password, users[0].password)){
        res.json({ info: "Logged In!" })
      } else {
        res.status(404).json({ error: 'You shall not pass' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
    
 });


 server.get('/api/users', (req, res) => {
  if(req.session && req.session.id){
    db.findUsers()
    .select('id', 'firstname', 'lastname')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  } else {
    res.status(400).send('You shall not pass!');
  }
 });



server.listen(3300, () => console.log('\nrunning on port 3300\n'));