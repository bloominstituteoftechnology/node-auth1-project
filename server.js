const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const User = require('./User.js');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('n\ ===connected to mongo === \n')
  })
  .catch(error => console.log('issues connecting to mongo', error));

const server = express();

//auth from lesson
function authenticate(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res
      .status(401)
      .send("Please login first");
  }
}

//express session stuff from lecture
const sessionConfig = {
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10
  })
};

server.use(express.json());
server.use(session(sessionConfig));
server.use(helmet());

// authtication method, session-less version, just kept here as reference
// function authenticate(req, res, next) {   const {username, password } =
// req.body;   User.findOne({ username }).then(user => {     if (user) {
// user.comparePassword(password).then(isMatch => {         if (isMatch) {
//     res.send('Welcome to the mines of moria fam');         } else {
// res.status(401).send('Invalid Username/password');         }       });     }
// else     res       .status(404)       .send('Invalid Username/Password!')
// }); } meant to see if the server is actually working
server.get('/', (req, res) => {
  res.send({api: 'running'})
})

//register user, adds to mongo database on completetion
server.post('/api/register', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(user => {
      res
        .status(201)
        .json({user})
    })
    .catch(error => {
      res
        .status(500)
        .send('error')
    });
})

// login function, non-session version server.post("/api/login", authenticate,
// (req, res) => {   res.send("Welcome to the Mines of Moria"); }); session
// version
server.post('/api/login', (req, res) => {
  const {username, password} = req.body;
  User
    .findOne({username})
    .then(user => {
      if (user) {
        user
          .comparePassword(password)
          .then(isMatch => {
            if (isMatch) {
              req.session.username = user.username;
              res.send('login successful');
            } else {
              res
                .status(401)
                .send('Invalid info!');
            }
          });
      } else 
        res
          .status(404)
          .send('Invalid info!');
      }
    )
    .catch(error => res.send('Login error'));
});

//grabs users
server.get("/api/users", authenticate, (req, res) => {
  User
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({error: 'Could not retrieve users'});
    });
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req
      .session
      .destroy(function (err) {
        if (err) {
          res.send("LOGOUT ERROR");
        } else {
          res.send("User is logged out");
        }
      });
  }
});

server.listen(5000, () => console.log('n\ === API Running! === \n'))