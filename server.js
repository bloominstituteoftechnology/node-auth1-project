// Import all of the packages we installed: Mongoose, express, session, Mongostore
const mongoose = require('mongoose'); //to communicate easily with our DB
const express = require('express'); // to utilize node more easily
const session = require('express-session'); //to develop sessions and cookies
const MongoStore = require('connect-mongo')(session); // to store sessions

//Import the User Schema
const User = require('./users/userSchema');

//to connect our localhost server to our mongo database
mongoose
  .connect('mongodb://localhost/authdb')
  .then(connection => {
    console.log('connection success!');
  })
  .catch(error => {
    console.log(error)
  });


const port = 3000;//to declare a server port for our _**what**
const server = express(); //to tell our server we are using express/node
server.use(express.json()); //to tell our server to use json syntax
server.use(session(sessionConfig)); //to tell our server to use the sessionConfig library **why**

//define our session config 
const sessionConfig = {
  cookie: {
    key: value,
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitalized: false,
  name: 'notExpressSession',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10 * 10,
  }),
};

// create an authentication function which can be used as local middleware
// check if a session/username are present, if so, move on to the next middleware
function authenticate(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401);
    res.send('Login failed, please try again');
  };
}
//**is this necessary?**
//endpoint HTTP Request: at default path '/', check if the session/username are present. 
server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back ${req.session.username}`);
  } else {
    res.send('Login failed, please try again');
  }
})

//HTTP Request endpoint at path '/register'
// create and save a new user based on the inputs of the request body
// hashes the password using the presave lifecycle hook in userschema.js
server.post('/register', function (req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

// HTTP Request Endpoint at path '/login':
// assign the username and password based on the request's body
// check the database to see if there is a User with the username passed from the request body.
// if so, check if the request password matches the hashed password on the user object in the database
server.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(validPassword => {
          if (validPassword) {
            req.session.username = user.username;
            res.send('Login Successful!');
            //**add a cookie**
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

// HTTP Request endpoint at path '/users/'
// run the authenticate middleware above. it checks for a session/username.
// if it passes, find the username in the user database, and send the user object back
server.get('/users', authenticate, (req, res) => {
  User.find().then(users => {
    res.send(users)})
});

//HTTP Request endpoint at path '/logout'
// check if a session is active, if so, destroy it and logout.
server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.send('error');
      } else {
        res.send('logout successful');
      }
    });
  }
});


// Gglobal middleware that ensures a user is logged in when accessing any route 
//prefixed by /api/restricted/. For instance, /api/restricted/something, /api/restricted/other, 
// and /api/restricted/a should all be protected by the middleware; only logged in users should be 
// able to access these routes.


// tell our server to listen to server.js on a port. 
server.listen(port, () => console.log(`\n == HOMIE YOU ARE NOW listening on port ${port}`));