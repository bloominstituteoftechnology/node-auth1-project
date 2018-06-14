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
  server.use('/api/register', routes);

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
      console.log(`Server up on port ${port}`);
  })

  server.get('/', (req, res) => {
      res.status(200).json({ message: 'Connected to server!' });
  })

  server.post('/register', (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) res.sendStatus(400);
      const user = new user(req.body);
      user.save()
        .then( user => res.status(201).json(user))
        .catch( err => res.status(500).send(err));
  })

  