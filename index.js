const express = require('express');
const server = express()
const cors = require('cors')
const helmet = require('helmet');
const router = require ('./apiRouter');
const session = require('express-session');


server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
}));

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use('/api', router);



server.listen(3300, () => console.log('\nrunning on port 3300\n'));