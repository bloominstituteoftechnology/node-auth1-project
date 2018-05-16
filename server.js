const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./User')

//normal boilerplate
mongoose
    .connect('mongodb://localhost/authdb')
    .then(conn => {
        console.log('\n=== connected to mongo ===\n');
    })
    .catch(err => console.log('error connecting to mongo', err));

const server = express();

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).send('You shall not pass!!!');
    }
  }

server.use(express.json());

const sessionConfig = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    }, // 1 day in milliseconds
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
    store: new MongoStore({
      url: 'mongodb://localhost/sessions',
      ttl: 60 * 10,
    }),
};


//server.use(greet);
server.use(express.json());
server.use(session(sessionConfig));

//below is just a check to make sure we can connect to our server
server.get('/', (req, res) => {
    if (req.session && req.session.username) {
      res.send(`welcome back ${req.session.username}`);
    } else {
      res.send('who are you? who, who?');
    }
  });

server.post('/register', function(req, res) {
    const user = new User(req.body);

    user
        .save()
        .then(user => res.status(201).send(user))
        .catch(err => res.status(500).send(err));
});

//below fails
server.post('/login', (req, res) => {
    const { username, password } = req.body;
    //below checks for username, findOne will recieve a query object and returns the first user that satisfies that filter
    User.findOne({username}).then(user => {
        if(user) {
            //compare passwords
            user.isPasswordValid(password).then(isValid => {
                if(isValid) {
                    req.session.username = user.username;
                    res.send('login successful, have a cookie')
                } else {
                    res.status(401).send('invalid credentials');
                }
            })
        } else {
            res.status(401).send('invalid credentials')
        }
    }).catch(err => res.send(err))
});

server.get('/users', authenticate, (req, res) => {
    User.find().then(users => res.send(users));
  });

server.get('/logout', (req, res) => {
if (req.session) {
    req.session.destroy(function(err) {
    if (err) {
        res.send('error');
    } else {
        res.send('good bye');
    }
    });
}
});
  
//set up server listener
server.listen(8000, () => console.log('\n=== api running on 8k ===\n'));


//below is scrap comments
//we can insert middleware here, below, right between the route and the parameters, within the middleware,
//next allows you to continue running the .post below
// server.post('/login', authenticate, (req, res) => {
//     res.send('Welcome to the minds of moria!');
// });

// Below is the scrap code
// function authenticate(req, res, next) {
//     User.findOne({ username: req.body.username }, function(err, user) {
//         if (err) throw err;
//         else user.comparePassword(req.body.password, function(err, isMatch) {
//             if (err) {
//                 throw err;
//                 console.log(req.body.username + ' could not login');
//             console.log(req.body.username + ' has logged in');
//             next();
//         }})
//     })
// }

//this is the middleware we have created
// function authenticate(req, res, next) {
//     //set a variable equal to hashed input
//     //find database password with username
//     //set variable equal to database password
//     //compare the two passwords
//     //if passwords are the same next
//     //if they are different decline
//     let login
//     bcrypt.hash(this.password, 11, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       let login = hash;
//     });
//     let realpassword;
//     User.get('/login', (req, res) => {
//     })
// //rest:
//     if (req.body.password === 'mellon') {
//         next();
//     } else {
//         res.status(401).send('You shall not pass!!!');
//     }
// }

