const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session)
const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

const sessionConfig = {
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  }),
  name: 'notsession', // default is connect.sid 
    secret: 'nobody tosses a dwarf!', //no one should know this but me
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: true,
 
}
//can also make sessionConfic const to set this data into server.use(session(sessionConfig))
server.use(session(sessionConfig));


server.get('/', (req, res) => {
  res.send('Is this thing working?');
});

//Create a new user with username and password
server.post('/register', (req,res) => {
  const credentials = req.body;
  //hash the password
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  //then save the user
  db('users').insert(credentials).then(ids => {
    const id = ids[0];
    res.status(200).json({ newUserId: id})
  })
  .catch(err => console.error(err))
})

//Login with credentials
server.post('/login', (req, res) => {
  const creds = req.body;

  db('users').where({username: creds.username}).first().then(user => {
    if(user && bcrypt.compareSync(creds.password, user.password)) {//compares the hashed password to the plain text password provided
      req.session.username = user.username; //setting the session username to users username
      res.status(200).json({welcome: user.username})
    }else{
      res.status(401).json({ message: 'DENIED'})
    }
  })
  .catch(err => res.status(500).json({err}))
})

// GET route to users
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//Logout endpoint
server.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(err => {
      if(err){
        res.send('No one leaves here alive..')
    }else{
      res.send('goodbye!')
    }
    });
  }
})

// Middleware checking for logged in users
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}

server.listen(3300, () => console.log('\nrunning on port 3300\n'));

