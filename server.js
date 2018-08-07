const express = require('express');

const server = express();

server.use(express.json());

const session = require('express-session');

const db = require('./auth/db');
const bcrypt = require('bcryptjs');

function protected (req, res, next) {
    if (req.session && req.session.email === 'blkfltchr@gmail.com') { // if this users email === 'blkfltchr@gmail.com'
        next(); // proceed to the endpoint
    } else {
        return res.status(401).json({ error: 'You shall not pass'}); // otherwise bounce em
    }};

server.use(
    session({
        name: 'monkey', // default is connect.sid
      secret: 'keyboard cat',
      cookie: { 
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
          secure: false, // flase because we're using http, true when using https
      },
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false, // forces the session to be saved back to the session store, even if the session was never modified during the request
      saveUninitialized: true,
    })
  );

  server.get('/setname', (req, res) => {
    req.session.name = 'Blake';
    res.send(`Session data is stored. Session name: ${req.session.name}`);
  });
  
  server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send(`G'day monsieur ${req.session.name}!`);
  });

server.get('/', (req, res) => {
    res.send('Up and running...')
})

server.get('/users', protected, (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).json(err));
});

server.post('/register', (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 14);
	user.password = hash;

    db('users')
        .insert(user)
        .then(ids => {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    req.session.email = user.email;
                    res.send(`Welcome ${user.email}`)
                });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/login', (req, res) => {
	const credentials = req.body;

    db('users')
        .where({email: credentials.email})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.email = user.email;
                res.send(`Welcome back ${user.email}`)
            } else {
                res.status(401).json({ error: 'You shall not pass'})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('Could not log out.');
        } else {
          res.send('Good bye for now, come back soon.');
        }
      });
    }
  });

const port = 8000;

server.listen(port, function() {
    console.log(`\n--- Web API Listening on http://localhost:${port} ---\n`);
})