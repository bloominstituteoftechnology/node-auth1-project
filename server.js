const cors = require('cors');
const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');

const db = knex(knexConfig.development);

const app = express();

app.use(express.json());
app.use(cors());



app.post('/api/register', (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;

  db('users').insert(creds).then(ids => {
    res.status(201).json(ids);
  }).catch(err => json(err));
});


app.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users').where({ username: creds.username }).first().then(user => {
    if(user && bcrypt.compareSync(creds.password, user.password)){
      res.status(200).json({ message: 'welcome' })
    }else{
      res.status(401).json({ message: 'You Shall Not Pass!!!!' })
    }
  }).catch(err => json(err));
});


app.get('/', (req, res) => {
  res.send('Server Is Alive, Register at /api/register');
});

app.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});


module.exports = app;   