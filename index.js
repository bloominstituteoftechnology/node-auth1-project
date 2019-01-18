// Base requirements
const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Server requirements
const server = express();
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);
const PORT = 5454;

/* ---------- Middleware ---------- */
const mw = require('./middleware.js');

// Route require:
const restRouter = require('./routes/restricted');


server.use(express.json());
server.use(session({
  name: 'auth1-session',
  secret: 'something not in this file or hardcoded here',
  cookie: {
    maxAge: 86400000
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
}));

/* ---------- Endpoints ---------- */
server.use('/api/restricted', restRouter);

// -----
// POST:
// - /api/register 	
// - Creates a user using the information sent inside the body of the request. 
// - Hash the password before saving the user to the database.
server.post('/api/register', (req,res) => {
  const newUser = req.body;
  
  // Only proceed for non-empty name & password
  if( newUser.name && newUser.password ) {
    newUser.password = bcrypt.hashSync(newUser.password, 12);
    db('users').insert(newUser)
      .then( (newId) => {
        res.status(201).json(newId);
      })
      .catch( (err) => {
        res.status(500).json({ error: "Could not register a new user."});
      })
    // end-db
  } else {
    res.status(400).json({error: "Please provide a name and a password."})
  }
});

// -----
// POST:
// - /api/login
// - Use the credentials sent inside the body to authenticate the user. On 
// - successful login, create a new session for the user and send back a 'Logged 
// - in' message and a cookie that contains the user id. If login fails, respond 
// - with the correct status code and the message: 'You shall not pass!'

server.post('/api/login', (req,res) => {
  const login = req.body;

  db('users').where('name', login.name).limit(1)
    .then( (user) => {
      if( user.length && bcrypt.compareSync(login.password, user[0].password)) {
        // Set session cookie's userId
        req.session.userId = user[0].id;
        res.json({ info: "Logged in" });
      } else {
        res.status(201).json({ error: "You shall not pass!" });
      }
    })
    .catch( (err) => {
      res.status(500).json({error: err });
    });
});


// -----
// GET:
// - /api/users
// - If the user is logged in, respond with an array of all the users contained in 
// - the database. If the user is not logged in repond with the correct status 
// - code and the message: 'You shall not pass!'.
server.get('/api/users', mw.protect, (req,res) => {
  db('users').select('id', 'username')
    .then( (users) => {
      res.json(users);
    })
    .catch( (err) => {
      res.status(500).json({error: err});
    });
});


/* ---------- Listener ---------- */
server.listen( PORT, () => {
  console.log(`\n=== Web API listening on http://localhost:${PORT} ===\n`);
});