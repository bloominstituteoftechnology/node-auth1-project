const express = require('express'); 
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');

const userRouter = require('./Users/userRouter.js');
const User = require('./Users/userSchema.js');

const server = express();

//middleware
const sessionOptions = {
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1000 * 60 * 60, // an hour
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
};

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}

server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

server.use('/api/register', userRouter);

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running' });
  });

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .validatePassword(password)
          .then(passwordsMatch => {
            if (passwordsMatch) {
              req.session.username = user.username;
              res.send('Have a cookie');
            } else {
              res.status(401).send('You shall not pass!');
            }
          })
          .catch(err => {
            res.send('error comparing password');
          });
      } else {
        res.status(401).send('You shall not pass!')
      }
    })
    .catch(err => { 
      res.send(err); 
    });
});

const port = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth-i', {}, err => {
  if (err) console.log(err);
  console.log('Mongoose connected us to our DB');
});

server.listen(port, () => {
    console.log(`Server up and running on ${port}`);
  });