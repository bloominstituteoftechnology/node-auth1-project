const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

const server = express();
const userRoute = require('./routes/users');

server.use(express.json());
server.use(helmet());

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

server.use('/api', userRoute);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});