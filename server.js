const mongoose = require('mongoose');
const express = require('express');
const port = 3000;
const server = express();

mongoose
  .connect('mongodb://localhost/authdb')
  .then(connection => {
    console.log('connection success!');
  })
  .catch(error => {
    console.log(error)
  });

server.use(express.json());


server.post('/log-in', (res, res) => {
  res.send(
    //   { route: '/log-in', message: 'Login successful!' })
    { money: 'bank' });

server.get('/', (req, res) => {
    res.send({ api: 'running' });
  })


server.listen(port, () => console.log(`\n == HOMIE YOU ARE NOW listening on port ${port}`));