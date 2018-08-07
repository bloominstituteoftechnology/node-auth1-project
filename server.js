const express = require('express');
const session = require('express-session');
const server = express();

// Imported Routers
const userRoute = require('./router/users');
const registerRoute = require('./router/register');
const loginRoute = require('./router/login');

// Middleware
server.use(express.json());

server.use(
    session({
      name: 'notsession', // default is connect.sid
      secret: 'nobody tosses a dwarf!',
      cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
      resave: false,
      saveUninitialized: false,
    })
  );
  

// Routes
server.use('/api/users', userRoute);
server.use('/api/register', registerRoute);
server.use('/api/login', loginRoute);

server.listen(8000, () => {
    console.log('===API===')
});