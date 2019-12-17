const express = require('express');
const helmet = require('helmet')
const cors = require('cors')
const sessions = require('express-session')
const KnexSessionStore = require('connect-session-knex')(sessions) //to store sessions in database
const knex = require('../data/dbConfig')


const sessionConfiguration = {
    //session storage options
    name: 'chocolatechip', //default session id name
    secret: 'keep it secret, keep it safe', //used for encryption
    saveUninitialized: true, // has implications with GDPR laws
    resave: false,
  
    store: new KnexSessionStore({ //do not forget the new keyword
      knex,
      createtable: true,
        
      clearInterval: 1000 * 60 * 10,
      sidfieldname: 'sid',
      tablename: 'sessions',  //imported from dbConfig
  
      }),
    //cookie options
    
    
    
    cookie:{
      maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
      secure: false,
      httpOnly: true,
    },
};




module.exports = server => {
    server.use(helmet())
    server.use(express.json())
    server.use(cors())
    server.use(sessions(sessionConfiguration))
    
};
