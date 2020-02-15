const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const knexSessionStore = require('connect-session-knex')(session);
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();



const sessionConfig ={
  name: 'monkey',
  secret: 'cookiesareyummy',
  cookie: {
    maxAge: 1000*60*60,
    secure: false,
    httpOnly:true
  },
  resave:false,
  saveUninitialized: false,
   
  store: new knexSessionStore({
    knex: require('../database/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createTable: true,
    clearInterval: 1000 *60 * 60
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
// const sessionMiddleware = session(sessionConfig)


server.use(session(sessionConfig))
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
