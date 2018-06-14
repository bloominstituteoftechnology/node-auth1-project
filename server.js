const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');

const server = express();

const database = require('./data/database');

const routes = require('./user/routes');
const user = require('./user/User');

database.connectTo('AuthMini')
  .then(() => {
      console.log('Connected to database!');
  })
  .catch(err => {
      console.log(err);
  })

  server.use(helmet());
  server.use(express.json());
  server.use('/api', routes);

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
      console.log(`Server up on port ${port}`);
  })
