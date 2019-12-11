//session using express
const session = require("express-session");
//session store using knex
const KnexSessionStore = require("connect-session-knex")(session); //currying
//routing
const knexstoreconfig = require("../dbConfig.js");

module.exports = {
  name: "excalibur",
  secret: "sword of destiny",
  resave: false, //avoid recreating unchanged sessions
  saveUninitialized: false, //GDPR compliance
  cookie: {
    maxAge: 1000 * 60 * 10, //milliseconds, session time
    secure: false, //use for https
    httpOnly: true //can JS access the cookie on the client?
  },
  //store is using session-express to be transferred to Knexsessionstore
  store: new KnexSessionStore({
    // knex: require('./database/dbConfig.js'), dont do this, lol
    knex: knexstoreconfig,
    tablename: "sessiondata",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 30 //milliseconds, deletes expired sessions
    //it works again
  })
};
