const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authAppdb')
  .then(conn => {
    console.log('\n=== connected to mongodb ===\n');
  })
  .catch(err => console.log ('error connecting to mongodb', err));

  const server = express();

  function authenticate(req,res,next) {
    if(req.session && req.session.username) {
      next();
    } else {
      res.status(401).send('wrong password please try again.')
    }
  }
  server.use(express.json());
  server.use(
    session({
      secret: 'nobody tosses a dwarf',
      cookie: { maxAge: 1*24*60*60*1000},
      httpOnly: true,
      secure: false,
      resave: true,
      saveUninitialized: false,
      name: 'noname',
      store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60*10,
        
      })
    })
  )

  server.get('/', (req, res) => {
    if (req.session && req.session.username) {
      res.send(`Welcome back ${req.session.username}`);
    }
    res.send(`Who are you`);
  });

  server.post('/api/register', function(req, res) {
    const user = new User(req.body);
    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  });


  server.post('/api/login', (req, res) => {
    console.log(res.body);
    const { username, password} = req.body;
    User.findOne({username}).then(user => {
      if(user) {
        user.isPasswordValid(password).then(isValid => {
          if(isValid) {
            req.session.username = user.username;
            res.send('Login successful')
          } else {

          }
        })
      } else {
        res.status(401).send('Invalid Creditials')
      }

    }).catch(err => res.send(err))
   
  });

server.get('/api/users', authenticate, (req, res) => {
 User.find().then(users => res.send(users))
  // put info here for checking if users is logged in display all users
})


  server.listen(8000, () => console.log('\n=== api running on port 8000 ===\n'));