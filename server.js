const express = require ('express');
const authnRouter = require('./authN /authnRouter');
const getuserRouter = require('./authN /getuserRouter');
const cors =require('cors');
const session = require('express-session');
const KnexSessionsStore = require('connect-session-knex')(session);
const db = require ('./data/dbConfig');

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'test secret',
    name: '',
    cookie: {
        maxAge: 1000 * 60*60*24,
        secure:process.env.NODE_ENV ==="production"? true : false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionsStore({
        knex: db,
        tablename: 'knexsessions',
        sidfieldname: 'sessionid',
        createtable: true,
        clearInterval: 1000*60*30
    }),
}

const server = express()
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));
server.use ('/authn', authnRouter);
server.use('/getuser', getuserRouter);

module.exports = server;