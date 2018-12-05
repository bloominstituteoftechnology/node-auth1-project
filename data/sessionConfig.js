const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./dbConfig')

const sessionConfig = {
  name: "Hobart",
  secret: '780d987gsdf09g87ds09guioerhu3lhlghdf9g3eohweohuwqhoiuhfoui984houhoewiuhhfjkdiuoe893oauihouhlsd',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false // only set it over https; in production you want this to be true
  },
  httpOnly: true, // no js can touch this cookie
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}

module.exports = sessionConfig;