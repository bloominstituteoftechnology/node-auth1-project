const express = require( 'express' );
const mongoose = require( 'mongoose' );
const User = require( './auth/UserModel' );

mongoose.connect( 'mongodb://localhost' ).then( () =>
{
    console.log( '/n*** connect to data ***/n' );
} );

const server = express();


server.use( express.json() );


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

server.get( '/api/users', ( req, res ) =>
{
    res.send( { message:'what is going on here' } );
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
    })

    
} );

server.listen( 5000, () =>
{
    console.log( '/n*** API running on port 5000 ***/n' );
} );
