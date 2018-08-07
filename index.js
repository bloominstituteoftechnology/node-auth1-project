const express = require('express');

const db = require('./data/db.js');

const bcrypt = require('bcryptjs');

const server = express();

const session = require('express-session')

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        return res.status(401).json({error:'Incorrect Credentials'});
    }
}

server.use(
    session({
      name: 'notsession', // default is connect.sid
      secret: 'nobody tosses a dwarf!',
      cookie: { 
          maxAge: 1 * 24 * 60 * 60 * 1000,
          secure: false,
       }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
       // only set cookies over https. Server will not send back a cookie over http.
      resave: false,
      saveUninitialized: true,
    })
  );

server.use(express.json());



///endpoints go here

server.get('/', (req, res) => {
    db('users')
        .then(proj => res.status(200).json(proj))
        .catch(err => res.status(500).json({error:'These are not the projects you are looking for'})
    )
})

server.post('/api/register', (req, res) => {
    const register = req.body;
    const hash = bcrypt.hashSync(register.password, 14);
    register.password = hash;
    if (!register.username || !register.password)
    res.status(400).json({errorMessage:"Required username and password"});
    db('users')
        .insert(register)
        .then(user => res.status(201).json(register))
        .catch(err => res.status(400).json({error: 'Error posting'}))
})

server.post('/api/login', function(req, res) {
    const credentials = req.body;

    db('users')
        .where({username: credentials.username })
        .first()
        .then(function(user) {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.username = user.username;
                res.send(`Hello ${user.username}`);
            } else{ 
                return res.status(401).json({ error: 'Incorrect credentials' });
            }
        })
        .catch(function(error) {
            res.status(500).json({ error });
        })
})

server.get('/api/users', (req, res) => {
    if(req.session && req.session.username) {
        db('users')
            .then(users => {
                res.json(users)
            }) 
            .catch(function(error) {
                res.status(500).json({error})
            })
    } else {
        res.status(401).json("incorrect credentials")
    }
})

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('good bye');
            }
        })
    }
})


// Another way of writing the get above using a protected function
// server.get('/users', protected, (req, res) => {
//     db('users')
//       .then(users => {
//         res.json(users);
//       })
//       .catch(err => res.send(err));
//   });



const port = 3300;
server.listen(port, function() {
 console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
