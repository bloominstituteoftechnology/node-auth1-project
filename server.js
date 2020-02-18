const session = require('express-session'); 
const express = require('express');
const apiRouter = require('./api/api-router');
const server = express();
const cors = require('cors');
const helmet = require('helmet');
const knexSessionStore = require('connect-session-knex')(session);


const sessionConfig = {
    name: 'monkeycookie', 
    secret: 'cookiesscectetpasowrdontheheadpasswcookie',
    cookie: {
      maxAge: 1000 * 60 * 60, //36milisec 1 hour old max 
      secure: false,
      httpOnly: true 
    }, 
     
    resave: false,
    saveUninitialized: false,


    store: new knexSessionStore({
      knex: require('./database/dbConfig.js'),
      tablename: 'sessons',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
}



server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));


// /api/api-router
server.use('/api', apiRouter);


server.get('/', (req, res) => {
    res.json({api: 'running on server!'})
})


module.exports = server;