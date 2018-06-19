const express = require( 'express' ); // remember to install your npm packages
const helmet = require( 'helmet' );
const cors = require( 'cors' );
const mongoose = require( 'mongoose' );
const bodyparser = require( 'body-parser' );
const session = require( 'express-session' );
const axios = require( 'axios' );
const bcrypt = require( 'bcrypt' );
const cookieparser = require( 'cookie-parser' );


const server = express();
const port = process.env.PORT || 8888;
const User = require( './database/auth/User' );


mongoose.connect( 'mongodb://localhost/authproj' ).then( () =>
{
    console.log( '\n*** Connected to database ***\n' );
} );

// add your server code
server.use( helmet() );
server.use( express.json() );
server.use( cors() );


// middleware
const sessionOptions = {
    secret: 'floccinaucinihilipilification- the action or habit of estimating something as worthless.',
    cookie: {
        maxAge: 1000 * 60 * 60, // an hour
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
};

function protected( req, res, next )
{
    if ( req.session && req.session.username )
    {
        next();
    } else
    {
        res.status( 401 ).json( { message: 'I done told you once, dont make me get Bubba on you!' } );
    }
}

server.use( session( sessionOptions ) );

server.get( '/api/users', protected, ( req, res ) =>
{
    User.find()
        .then( users => res.json( users ) )
        .catch( err => res.json( err ) );
} );

server.get( '/', ( req, res ) =>
{
    if ( req.session && req.session.username )
    {
        res.status( 200 ).json( { message: `your name looks familiar ${ req.session.username }. make yourself at home!` } );
    } else
    {
        res.status( 401 ).json( { message: 'whos your people again?' } );
    }
} );

server.post( '/api/register', ( req, res ) =>
{
    User.create( req.body )
        .then( user =>
        {
            res.status( 201 ).json( user );
        } )
        .catch( err =>
        {
            res.status( 500 ).json( err );
        } );
} );

server.post( '/api/login', ( req, res ) =>
{
    // grab credentials
    const { username, password } = req.body;

    // find the user to get access to the store password
    User.findOne( { username } )
        .then( user =>
        {
            if ( user )
            {
                // compare password guess to the stored password
                user
                    .validatePassword( password )
                    .then( passwordsMatch =>
                    {
                        // the passwords match, the can continue
                        if ( passwordsMatch )
                        {
                            req.session.username = user.username;
                            res.send( 'alright, the doorman said youre cool, come on in' );
                        } else
                        {
                            res.status( 401 ).send( 'wrong again man' );
                        }
                    } )
                    .catch( err =>
                    {
                        res.send( 'that aint right...' );
                    } );
            } else
            {
                // if not found
                res.status( 401 ).send( 'this aint even here buddy...' );
            }
        } )
        .catch( err =>
        {
            res.send( err );
        } );
} );

server.get( '/api/logout', ( req, res ) =>
{
    if ( req.session )
    {
        req.session.destroy( err =>
        {
            if ( err )
            {
                res.send( 'why you trying to leave?' );
            } else
            {
                res.send( 'fine be that way! we didnt like you anyway!' );
            }
        } );
    }
} );



server.listen( port, () =>
{
    console.log( `Server up and running on http://localhost:${ port }` );
} );
