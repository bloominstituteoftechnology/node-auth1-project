const express = require('express');
const helmet = require('helmet')

//sessions:
const session = require('express-session')
const KnexSessionStorage = require('connect-session-knex')(session);
const knexConnection = require('../data/dbconfig.js')

const server = express();

const sessionConfiguration = {
    name: 'bananaS',
    secret: process.env.COOKIE_SECRET || 'coconut',
    cookie: {
      maxAge: 1000 * 60 * 60 * 72, //72 hrs.
      secure: process.env.NODE_ENV === 'development' ? false : true,
      httpOnly: true, 
    }, 
    resave: false,  
    saveUninitialized: true,
    store: new KnexSessionStorage({
        knex: knexConnection,
        clearInterval: 100 * 1000 * 60 * 60,
        tablename: 'user_session',
        sidfieldname: 'id',
        createtable: true 
    })
}

server.use(express.json());
server.use(helmet());
server.use(session(sessionConfiguration))

const users = require('../routes/users-router')
server.use('/api/users', users);

const authorize = require('../routes/auth-router')
server.use('/api/auth', authorize);

server.get('/', (req,res) => {
    // res.send(`
    //   <h2>Lambda Web Auth I</h>
    // `);
    res.json({ api: "up", session: req.session });
})

module.exports = server;