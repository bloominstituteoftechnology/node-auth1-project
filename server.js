// Requirements
const knex = require('knex');
const express = require('express');
const bcrypt = require('bcryptjs');
const knexConfig = require('./knexfile');
const session = require('express-session');
const cors = require('cors');

// Instantiations
const server = express();
const db = knex(knexConfig.development);

// Middleware


const sessionConfig = {
    name: 'monkey', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  };


server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

// Endpoints
// server.get('/', (req, res) => {
//     res.status(200).send('Server is running!');
// });

server.post('/api/register', (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 8);

    creds.password = hash;

    db('users_table')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id);
        })
        .catch(err => {
            console.log('/api/register POST error:', err);
            res.status(500).send('Please try again later');
        });
});

server.get('/api/users', (req, res) => {
    db('users_table').select('id', 'username').then(users => {
        res.status(201).json(users);
    }).catch(err => {
        console.log("error:", err);
        res.status(500).json(err);
    })
});


server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users_table')
    .where({username: creds.username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)){
            req.session.username = user.username;
            res.status(200).send(`Welcome ${req.session.username}`);
        } else {
            res.status(401).json({message: 'incorrect combination'});
        }
    }).catch(err => {
        console.log('/api/login Post error:', err);
        res.status(500).send(err, "Everything failed")});
})

server.get('/', (req, res) => {
    req.session.name = 'Frodo';
    res.send('got it');
  });
  
  server.get('/greet', (req, res) => {
    const name = req.session.username;
    res.send(`hello ${name}`);
  });




// Other Settings
const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}!`));