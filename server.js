const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const userRouter = require('./users/userRouter.js');

mongoose.connect('mongodb://localhost/authidb').then(() => {
    console.log('\n *** Connected to authidb database ***\n');
});

const server = express();

// middleware
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

server.use(express.json());
server.use(session(sessionOptions));

server.use('/api', userRouter);

server.get('/', (req, res) => {
  console.log(req.session);
  if (req.session && req.session.username) {
    res.status(200).json({ message: `welcome back ${req.session.username}` });
  } else {
    res.status(401).json({ message: 'speak friend and enter' });
  }
});

const port = 8000;
server.listen(port, () => { console.log(`\n*** API running on port ${port} ***\n`)});