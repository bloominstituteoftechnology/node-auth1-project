const express = require('express');
const helmet = require('helmet');
// const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const knexConfig = require('./knexfile');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
// const Users = require('./databaseFns');
// require('dotenv').config();

const db = knex(knexConfig.development);
const server = express();

const sessionConfig = {
  name: 'falling raindrops',
  secret: '89deav985ergb7e704a393e7a1203c524c3cc',
  cookie: {
    maxAge: 1000 * 60 * 20, //20min in ms?
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions', 
    sidfieldname: 'sid',
    createTable: true,
    clearInterval: 1000 * 60 * 60, //every hour
  })
}

server.use(express.json());
// server.use(cors());
server.use(helmet());
server.use(session(sessionConfig));

//check cookie
hasCookie = (req, res, next) => {
  if(req.session && req.session.user) {
    next();
  } else {
    res.status(404).json({ msg: 'unauthorized'});
  }
}

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`\n** server listening on port ${port} **\n`);
});

server.get('/', (req, res) => {
  res.send('hello world!');
})

//Get users = /api/users  
  //restricted
server.get('/api/users', hasCookie, async (req, res) => {
  try {
    const users = await db('users');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
})

//Get user by id = /api/users/{:id}
  //restricted
server.get('/api/users/:id', hasCookie, async (req, res) => {
  // console.log(req.params.id);
  // console.log(req.session.user.id === req.params.id);
  // if(req.session.user.id === req.params.id) {
  //   res.status(200).json({ msg: `Welcome to your dashboard, ${user.username}` });
  // } else {
  //   res.status(404).json({ msg: 'unauthorized' });
  // }
  try {
    const user = await db('users')
    .where({ id: req.params.id })
    .first()
    if(req.session.user.id === user.id) {
      res.status(200).json({ msg: `Welcome to your dashboard, ${user.username}` });
    } else {
      res.status(404).json({ msg: 'unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'user not found', error});
  }
})

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
    req.session.user = newUser;
    res.status(200).json({ msg: 'created new user', newUser});
  } catch (error) {
    res.status(500).json({msg: 'cannot create user', error});
  }
})

//put to login = /api/login 
  //return logged in and user id, and cookie
server.put('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db('users')
    .where({ username })
    .first()
  if(user && bcrypt.compareSync(password, user.password)){
    //create session
    req.session.user = user;
    const id = user.id;
    res.status(200).json({ msg: `welcome ${username}! Have a cookie`, id})
  } else {
    res.status(401).json({msg: 'incorrect password'})
  }
  } catch (err) {
    res.status(500).json({ msg: 'user not found'});
  }
})

//logout = session.destroy()
server.get('/api/logout', (req, res) => {
  if(req.session){
    req.session.destroy( err => {
      if(err){
        res.send('cannot log out');
      } else {
        res.send('logout success');
      }
    })
  }
})