//IMPORTS
const express = require( 'express' );
const morgan = require( 'morgan' );
const helmet = require( 'helmet' );
const cors = require( 'cors' );
const db = require( '../data/dbConfig' );
const session = require( 'express-session' );
const KnexSessionStore = require( 'connect-session-knex' )( session );
const server = express();

//ROUTER IMPORTS
const authRouter = require( '../auth/auth-route' );
const userRouter = require( '../users/users-route' );

//COOKIE CONFIG
const sessionConfig = {
    name: 'The Mothership',
    secret: 'Take me to your leader',
    cookie: {
        maxAge: 1000 * 60 * 60, //one hour
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore ({
        knex: db,
        tableName: 'sessions',
        createtable: true,
        clearInterval: 1000 * 60 * 60 //also one hour
    })
}

//USE SERVER DEPENDENCIES ( global )
server.use( helmet());
server.use( express.json());
server.use( morgan( 'common' ));
server.use( cors() );
server.use( session( sessionConfig ));

//ROUTES
server.use( '/api/auth' , authRouter );
server.use( '/api/users' , userRouter );


//CR FUNCTIONS
server.get( '/' , ( req , res ) => {
    return res.status( 200 ).json({ Greetings: " WECOME TO THE VOID 🌙 "})
})

module.exports = server;