const session = require("express-session");
const KnexSessionStore = require('connect-session-knex')(session);
// used to persist data in DB even after server restarts
const configuredKnex = require('../database/dbConfig.js');

module.exports = {
  name: "cookie monster", // session name to increase security
  secret: "mellon",
  cookie: {
    maxAge: 1000 * 60 * 10, // milliseconds, 10 min
    secure: false, // use cookie over https (development)
    httpOnly: true // false means JS can access the cookie on the client
  },
  resave: false, // avoid recreating unchanged sessions
  saveUninitialized: true, // GDPR complicance, if user does not want cookies, then false
  store: new KnexSessionStore({
    knex: configuredKnex,
    tablename: 'session',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30, // deletes expired sessions every 30 min
  })
}