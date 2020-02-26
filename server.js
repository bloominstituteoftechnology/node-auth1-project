const express = require('express');
const server = express();
const usersRouter=require('./data/users/users-router')




server.use(express.json());
server.use('/api/users', usersRouter);
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware


module.exports = server;
