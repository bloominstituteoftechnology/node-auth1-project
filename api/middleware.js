//file contains all middleware

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');// when going across domains server
// will protect it selt.  Cross origin resource sharing. default not allowed.
//must configure cors to allow requests from another domain.
const session = require('express-session')


//configure sessions and cookies
const sessionConfiguration = {
  name: 'Boom',
  //need to encrypt, and decrypt to read
  secret: process.env.COOKIE_SECRET || 'is it the legion of secret key',
  cookie: {
    maxAge: 1000 *60 * 60, //valid for 1 hour
    secure: process.env.NODE_ENV === 'development' ? false : true, //do we send cookies over https? deve false, anywhere else true
    httpOnly: true, //prevent client js.code access to cookie, set to true in development
  },
  resave: false, //forces the session to be saved back to the session store, even if the session was never modified during the request.
  saveUninitialized: true, //false is useful for implementing login sessions,
  // reducing server storage usage, or complying with laws that require permission before setting a cookie.
  // store: new KnexSessionStorage({
  //   knex: knexConnection,
  //   clearInterval: 1000 * 60 * 10, // delete expired sessions every 10 minutes
  //   tablename: "user_sessions",
  //   sidfieldname: "id",
  //   createtable: true
  // })
}

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfiguration)) //added to create session db, npm i express-session
};
