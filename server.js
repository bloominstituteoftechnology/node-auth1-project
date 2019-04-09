const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const authRouter = require('./auth/auth-router.js');
//const usersRouter = require('./users/users-router.js');
const KnexSessionStore = require('connect-session-knex')(session);
//connectSessionKnex(variable)
const dbConfig = require('./database/dbConfig.js')

const server = express();

const sessionConfig = {
  name: 'monkey-pants',
  secret: process.env.SECRET || 'This is a secret',
  cookie:{
    maxAge: 1000 * 60 * 60, //How long session is valid for 
    secure: false, //cookie allowed over https only?
    httpOnly: true, //cannot access the cookie from JS using document.cookie
  },
  resave: false, //keep it false to avoid recreating sessions that have not changed
  saveUninitialized: false, //GDPR laws against settings cookies automatically
  store: new KnexSessionStore({
    knex: dbConfig,
    tablename: 'sessions', //table will store sessions inside the db, name it whatever
    sidfieldname: 'sid', //column that will hold the session id, name it whatever
    createtable: true, //If table doesn't exist, create it automatically
    clearInterval: 1000 * 60 * 10 //time to check for old sessions and remove them from the database
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))


server.use('/api/auth', authRouter);
//server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send("It's Working!");
});

module.exports = server;
