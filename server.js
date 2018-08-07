const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const apiRoutes = require('./api/apiRoutes');

const server = express();

server.use(express.json());
server.use(morgan('dev'));

server.use(
  session({
    name: 'notsession',
    secret: 'blah blah blah',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
  })
);

server.use('/api', apiRoutes);

server.listen(8000, () => console.log('\n=== API running on port 8000 ===\n'));
