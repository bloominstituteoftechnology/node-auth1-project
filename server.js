const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const knex = require('knex');
const bycrypt = require('bcryptjs');

const server = express();
const port = 3333;

const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

server.use(express.json());
server.use(cors());
server.use(helmet());


server.get('/', (req, res) => {
  res.send('hello');
});


server.get('/api/users', (req, res) => {
  db('users').select('id', 'username')
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => console.log(err));
});


server.post('/api/register', (req, res) => {

  !req.body.username || !req.body.password ?
  res.status(400).json({message: 'You need a username AND password'})
  :
  null

  const credentials = req.body;
  const hash = bycrypt.hashSync(credentials.password, 10);
  credentials.password = hash;

  db('users').insert(credentials)
  .then(ids => {
    const id = ids[0];
    res.status(201).json(id);
  })
  .catch(err => {
    console.log(err)
  });

});


server.post('/api/login', (req, res) => {
  
  !req.body.username || !req.body.password ?
  res.status(400).json({message: 'You need a username AND password'})
  :
  null

  const credentials = req.body;

  db('users').where({username: credentials.username}).first()
  .then(user => {
    if (user && bycrypt.compareSync(credentials.password, user.password)) {
      res.status(200).json({message: 'success'})
    } else {
      res.status(401).json({message: 'cannot pass'})
    }
  })
  .catch(err => {
    console.log(err)
  });
});


server.listen(port, () => console.log(`listening on port ${port}`));
