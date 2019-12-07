//? s3
const express = require('express');

// ! s52 Session and cookies
//? s52
const session = require('express-session');

//? s62
const KnexSessionStorage =require('connect-session-knex')(session)

//? s57
const authRouter = require('../auth/auth-router.js')
const usersRouter = require('../users/users-router.js')

//? s64
const knexConnection = require('../database/dbConfig.js')

//? s20
// const apiRouter = require('./api-router.js');

//? s10
const configureMiddleware = require('./configure-middleware.js');

//? s54
const sessionConfig = {
  name: 'booger', // default name is sid,
  secret: process.env.COOKIE_SECRET || 'is it secret? is it safe?',
  cookie: {
    maxAge: 1000 * 60 * 60, // valid for 1 hour (in milliseconds)
    // secure: process.env.NODE_ENV === 'production' ? true : false, // during production true
    secure: process.env.NODE_ENV === 'development' ? false : true, // during development false, // do we send cookie over https only?
    httpOnly: true // always true unless to prevent client javasript code from accessing the cookie
  },
  //? s63
  store: new KnexSessionStorage({
      knex: knexConnection,
      clearInterval: 1000 * 60 * 10,
      tablename: 'user_sessions',
      sidfieldname: 'id',
      createtable: true
  })
};

//? s4
const server = express();

//? s53
server.use(session(sessionConfig));

//? s11
configureMiddleware(server);

//? s12 create api-router.js file

//? s5
// server.use('/api', apiRouter);

//? s56
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.json({api: 'up', session: req.session})
})



//? s6
module.exports = server;

//? s7 create configure-middleware.js for middleware ie helmet, cors, express, etc...
