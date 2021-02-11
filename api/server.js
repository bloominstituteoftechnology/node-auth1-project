const express = require('express');
const server = express();
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan')
const session = require('express-session')
const guestRouter = require('./router/guestRouter');
const authRouter = require('./router/authRouter');
const KnexSessionStore = require('connect-session-knex')(session);


//sessionConfig 
const sessionConfig = {
    name:'no-session',
    secret: 'keep it secret keep it safe',
    cookie:{
        maxAge: 60 * 60 * 1000,
        secure: false ,//true in production
        httpOnly: true
    },
    resave: true,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: require('../data/dbConfig'),
        table: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 60 * 60 * 1000
    })
}

//middlewares
server.use(
    express.json(), 
    helmet(), 
    cors(), 
    logger('short'), 
    session(sessionConfig)
    );

//routers
server.use('/api/', guestRouter)
server.use('/api/', authRouter)



//middleware



module.exports = server
