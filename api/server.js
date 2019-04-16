const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const userRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'monkey', // the default would be sid, but that would reveal our stack.
  secret: 'keep it secret, keep it safe!', // to encrypt/decrypt the cookie 
  cookie: {
      maxAge: 1000 * 60 * 60, // How long is the session valid for in milliseconds
      secure: false, // used over https only, should be true in production
  },
  httpOnly: true, // cannot access the cookie from JS using document.cookie
  // keep this true unless there is a good reason to let JS access the cookie 
  resave: false, // keep this false to avoid recreating sessions that have not changed
  saveUnitialized: false, // GDPR laws against setting cookies automatically
  store: new KnexSessionStore({
    knex: require('../data/dbConfig.js'),
    sectionname: 'sessions', // table that will store sessions, name it anything you want
    sessionidname: 'sid', // column that will hold the session id, name it anything you want
    createtable: true, // if table doesn't exist it will create one automatically
    clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database if we dont need them
  })
}

server.use(session(sessionConfig))
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send("API running!");
});


module.exports = server;