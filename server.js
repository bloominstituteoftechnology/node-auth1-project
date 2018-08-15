const express = require ('express');
const db= require('./data/db');
const bcrypt= require('bcryptjs');
const session= require('express-session');
const server= express();

server.use(
    session({
      name: 'notsession', // default is connect.sid
      secret: 'nobody tosses a dwarf!',
      cookie: { 
          maxAge: 1 * 24 * 60 * 60 * 1000,
          secure: true // only set cookies over https. Server will not send back a cookie over http.
        }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false,
      saveUninitialized: false,
    })
  );

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Auth-i');
});

server.get('/setname', (req, res) => {
    req.session.name = 'Frodo';
    res.send('got it');
  });
  
server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send(`hello ${req.session.name}`);
  });

///////////////////// Endpoints

server.post('/register', (req, res) => {
    const users=req.body;

    const hash=bcrypt.hashSync(users.password, 14);
    users.password=hash;

    db.insert(users)
    .into('users')
    .then(ids => {
        const id=ids[0];
        res.status(200).json({id, users})
    })
    .catch(error =>{
        res.status(500).json(error)
    })
});

server.post('/login', (req, res)=> {
    const credentials=req.body;
    db('users')
    .where({ username:credentials.username })
    .first()
    .then(function (user) {
        if (user && bcrypt.compareSync(credentials.password, username.password)) {
            req.session.username=user.username;
            res.send(`Welcome ${user.username}`);
        } else {
            return res.status(401).json({ error: 'Incorrect credentials'});
        }
    })
    .catch(function(error){
        res.status(500).json({error});
    });
});

server.get('/users', (req, res) => {
    db('users')
    .then(user=>{
        res.status(200).json(user);
    })
    .catch(error=> res.status(500).json(error));
});









///////////////////// Endpoints

const port = 7700;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});