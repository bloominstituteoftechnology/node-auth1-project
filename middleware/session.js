const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('../data/dbConfig');

const sessionConfig = {
    name: 'notACokkie',
    secret: 'sibnagi4b39487tgbupwa9ifubn', // keep as env variable
    cokkie: {
        maxAge: 1000 * 60 * 10,
        secure: false // set true if in porductino on https
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'session',
        sidfieldname: 'sid',
        knex: db,
        createTable: true,
        clearInterval: 1000 * 60 * 10
    })
}

module.exports = session(sessionConfig);
