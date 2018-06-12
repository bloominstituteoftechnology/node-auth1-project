const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session')
const User = require('./auth/UserModel');

// mongoose.connect('mongodb://localhost/cs10').then(() => {
//   console.log('\n*** Connected to database ***\n');
// });

const server = express();

server.use(cors());
server.use(express.json());

const session = require('express-session');
server.use(
  session({
    secret: 'nobody toss a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    secure: true,
  })
);

server.use('/api/user', userRouter);

server.get('/', (req, res) => {
  res.status(200).json({
    api: 'running...'
  });
});



mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/authDb', {}, err => {
  if (err) console.log(err);
  console.log('you are connected to DB');
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});