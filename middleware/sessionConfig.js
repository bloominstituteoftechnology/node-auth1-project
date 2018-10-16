// Node Dependencies
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// Export function that takes a database as an argument
// and returns a session instance
module.exports = (db) => session(
    { 
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    }),
    name: 'user-session',
    secret: 'User session secret is a mystery',
    cookie: {
        maxAge: 1 * 60 * 1000,
        secure: false,
    }
},
{
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
  }
)