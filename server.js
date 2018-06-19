const express = require( 'express' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const User = require( './auth/UserModel' );

mongoose.connect( 'mongodb://localhost' ).then( () =>
{
    console.log( '/n*** connect to data ***/n' );
} );

const server = express();
//middleware
const sessionOptions = {
    secret: 'nobody tosses a dwarf',
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
};

server.use( express.json() );
server.use( session( sessionOptions ) );


server.get( '/api/users', ( req, res ) =>
{
    User.find()
        .then( users =>
        {
            res.status( 200 ).json( users );
        } )
        .catch( err =>
        {
            res.status( 500 ).json( { error: 'Error' } )
        } );
} )

server.get( '/', ( req, res ) =>
{
    if ( req.session && req.session.username )
    {
        res.status( 200 ).json( { message: `welcomeback${ req.session.username }` } )
    } else
    {
        res.status( 401 ).json( { message: 'speak friend and enter' } );
    }
} );

server.post( '/api/register', ( req, res ) =>
{//save the user to the database
    //const user = new User (req.body);
    //user.save().then().catch;

    // or an alternative syntax would be


    User.create( req.body )
        .then( user =>
        {
            res.status( 201 ).json( user );
        } ).catch( err =>
        {
            res.status( 500 ).json( err );
        } )


} );

server.post( '/api/login', ( req, res ) =>
{
    //grab credentials
    const { username, password } = req.body;
    //find the user to get to the store password
    User.findOne( { username } )
        .then( user =>
        {
            if ( user )
            {

                user
                    .validatePassword( password )
                    .then( passwordsMatch =>
                    {
                        if ( passwordsMatch )
                        {
                            req.session.username = user.username;

                            res.send( 'have a cookie' );
                        } else
                        {
                            res.status( 401 ).send( 'invalid credentails' );
                        }

                    } )
                    .catch( err =>
                    {
                        res.send( 'error comparing passwords' );
                    } );
            } else
            {
                res.status( 404 ).send( 'invalid creditials' );
            }

        } )
        .catch( err =>
        {
            res.send( err );
        } )
} );
server.listen( 5000, () =>
{
    console.log( '/n*** API running on port 5000 ***/n' );
} );
