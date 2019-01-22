const express = require('express');
const bcrypt = require('bcryptjs')
const db = require('./data/dbHelpers');
const session = require('express-session');

const server = express();

server.use(express.json());
server.use(session({
  name: 'notSession',
  secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 *1000 // sets the expiration date in milliseconds
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    //typically, we'd also use secure: true, // so that the server only set cookies over https. Server will not send back a cookie over http.
}))

server.get('/', (req, res) => {
  res.send('This is working');
});

const Port = 3300;

// store a username and password
server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password)
    db.insert(user)
    .then(ids => {
      res.status(201).json({id: ids[0]})
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

server.post('/api/login', (req, res) => {
   const user = req.body;
   console.log(user)
   db.findByUsername(user.user_name)
   .then(users => {
     //username validation, client password validation from db
     if(users.length && bcrypt.compareSync(user.password, users[0].password, 10)) {
        req.session.userId = users[0].id;
        res.json({ info: "Logged in"})
     }
     else {
       res.status(404).json({message: "You shall not pass!"})
     }
   })
})

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  console.log('session', req.session)
  if(req.session && req.session.userId){
  db.findUsers()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  } else {
    res.status(400).send('access denied');
  }
 });

server.listen(Port, () =>
 console.log(`running on port ${Port}`));



