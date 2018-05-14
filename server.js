const mongoose = require('mongoose');
const express = require('express');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('n\ ===connected to mongo === \n')
  })
  .catch(error => console.log('issues connecting to mongo', error));


  const server = express();

  // const auth = (req, res, next) {
  //   if (req.body.password )
  // }

  server.get('/', (req, res) => {
    res.send({api: 'running'})
  })



  server.listen(5000, () => console.log('n\ === API Running! === \n'))