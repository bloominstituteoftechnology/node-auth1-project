const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const User = require('./user/user');

mongoose.connect('mongodb://localhost/authProjectdb')
    .then(conn => {
        console.log('\n== Connected to Database! ==\n')
    })
    .catch(err => {
        console.log('\n== Error connecting to database, sorry! ==\n')
    })

const server = express();

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('Sorry, you dont have access to this currently.')
    }
}

const sessionConfig = {
    secret: 'This is my secret...',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
    secure: false,
    resave: false,
    saveUninitialized: false,
    name: 'noname',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
    }),
};

server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.send(`\n Welcome back ${req.session.username}\n`);
    } else {
        res.send('who are you?...I dont know you. ')
    }
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user 
    .save()
    .then(user => {
        res.status(201).json({ user })
    })
    .catch(err => {
        res.status(500).send('Error creating, uh oh!');
    });
})

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    User.findOne({ username })
      .then(user => {
        if (user) {
          user.isPasswordValid(password).then(isValid => {
            if (isValid) {
              req.session.username = user.username;
              res.send('Welcome user!');
            } else {
              res.status(401).send('invalid password');
            }
          });
        } else {
          res.status(401).send('invalid username');
        }
      })
      .catch(err => res.send(err));
  });

server.get('/api/users', authenticate, function(req, res) {
    User.find().then(users => {
        res.send(users);
    });
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                res.send('Error');
            } else {
                res.send('good bye');
            }
        });
    }
});

server.listen(5000, () => console.log('Server running on port 5000'));