const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const knexConfig = require('./knexfile');
// const Users = require('./databaseFns');

const db = knex(knexConfig.development);

const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`\n** server listening on port ${port} **\n`);
});

server.get('/', (req, res) => {
  res.send('hello world!');
})

//Get users = /api/users  
  //restricted
server.get('/api/users', async (req, res) => {
  try {
    const users = await db('users');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
})

//Get user by id = /api/users/{:id}
  //restricted
// server.get('/api/users/:id', async (req, res) => {

// })

//post to register = /api/register
server.post('/api/register', async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 11);
  user.password = hash;

  try {
    const [id] = await db('users').insert(user);
    const newUser = await db('users')
    .where({ id })
    .first()
    res.status(200).json({ msg: 'created new user', newUser});
  } catch (error) {
    res.status(500).json({msg: 'cannot create user', error});
  }
})

//put to login = /api/login 
  //return logged in and user id
  //not working?
server.put('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db('user')
    .where({ username })
    .first()
  if(user && bcrypt.compareSync(password, user.password)){
    const id = user.id;
    res.status(200).json({ msg: `welcome ${username}!`, id})
  }
  res.status(401).json({msg: 'incorrect password'})
  } catch (err) {
    res.status(500).json({ msg: 'user not found'});
  }
})