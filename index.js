const express = require('express');
const cors = require('cors');

//PORT
const PORT = 8000;
//server
const server = express();
const register = require('./data/routes/register');
const login = require('./data/routes/login');
const users = require('./data/routes/users');
const session = require('express-session');
//Middleware
server.use(express.json());
server.use(
    session({
      name: 'notsession', // default is connect.sid
      secret: 'nobody tosses a dwarf!',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true, // only set cookies over https. Server will not send back a cookie over http.
      }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false,
      saveUninitialized: false,
    })
  );

server.use(cors());
server.use(register);
server.use(login);
server.use(users);

server.get('/', (req,res) => {
    res.status(200).json(`We are live now here.`);
});

server.listen(PORT, () => {
   console.log(`Server is running at http://localhost${PORT}`);
})
