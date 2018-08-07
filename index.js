const express = require('express');
const db = require('./data/db.js');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const session = require('express-session');
const server = express();

server.use(express.json());
server.use(helmet());

function protection (req, res, next) {   
    if (req.session && req.session.username === 1) {
        next();
    } else {
        return res.status(401).json({ error: 'Please enter correct login information.'});      
      }
}

server.use(
    session({
      name: 'godzilla', // default is connect.sid
      secret: 'Look! It is GOJIRA!',
      cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      secure: true, // only set cookies over https. Server will not send back a cookie over http.
      resave: false,
      saveUninitialized: false,
    })
  );


//   server.get('/', (req, res) => {
//     req.session.name = 'Frodo';
//     res.send('got it');
//   });
  
//   server.get('/greet', (req, res) => {
//     const name = req.session.name;
//     res.send(`hello ${req.session.name}`);
//   });


// AUTH REGISTER
server.post('/api/register', (req, res) => {
    const register = req.body;

    console.log("register", register);
    const hash = bcrypt.hashSync(register.password, 14);

    register.password = hash;

    db.insert(register)
     .into('project')
     .then(ids => ({ id: ids[0] }))
     .then(response => {
         res.status(201).json(response[0]);
     })
     .catch(err => {res.status(404).json(err)});
})

// AUTH LOGIN
server.post('/api/login', (req, res) => {
    const login = req.body;
    req.session.name = login.name;

    
db('project')
    .where({ name: req.session.name})
    .first()
    .then( (user) => {
        if (user && bcrypt.compareSync( login.password, user.password)) {
            res.send('welcome');
    
        } else {
            return res.status(401).json({ error: 'You shall not pass!'});
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
})

// AUTH USERS
server.get('/api/users', protection, (req, res) => {
    const name = req.session.name;

    db.select(name)
    .table('project')
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {res.status(500).json(err)});
})

// AUTH LOGOUT
server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye');
        }
      });
    }
  });


const port = 8000;
server.listen(port, () => {
    console.log(`\n === Auth API listening on http://localhost:${port} ===\n`);
});