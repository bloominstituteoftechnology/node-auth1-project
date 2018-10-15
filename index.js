const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get('/', (req, res) => res.json('Server is up and running!'));

server.post('/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 16);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      res.status(201).json({ id: ids[0] });
    })
    .catch(() =>
      res.status(500).json({ error: 'Oops! User could not be created.' })
    );
});

const port = 6000;
server.listen(port, () => console.log(`API is listening on port ${port}.`));
