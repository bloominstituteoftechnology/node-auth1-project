//IMPORTS
const express = require( 'express' );
const morgan = require( 'morgan' );
const cors = require( 'cors' );
const server = express();
const bcrypt = require('bcryptjs');
const Users = require( './users/userModel' ); 
const restricted = require( './middleware/middleware' );

//USE SERVER DEPENDENCIES
server.use(express.json());
server.use(morgan( 'common' ));
server.use(cors());

//CR FUNCTIONS
server.get( '/' , ( req , res ) => {
    return res.status( 200 ).json({ Greetings: " WECOME TO THE VOID 🌙 "})
})


server.post( '/api/register' , ( req , res ) => {
    let user = req.body;
    const hash = bcrypt.hashSync( user.password , 16 );
    user.password = hash;
    Users.add( user )
        .then( saved => {
            res.status( 201 ).json( saved );
        })
        .catch( error => {
            res.status( 500 ).json( error );
        });
});

server.post( '/api/login' , ( req , res ) => {
    let { username , password } = req.body;

    Users.findBy({ username })
        .first()
        .then( user => {
            if ( user && bcrypt.compareSync( password , user.password )) {
                res.status( 200 ).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status( 401 ).json({ message: 'Invalid Credentials' });
            }
        })
        .catch( error => {
            res.status( 500 ).json( error );
        });
});

server.get( '/api/restricted/users' , restricted , ( req , res ) => {
    Users.find()
        .then( users => {
            res.json( users );
        })
        .catch( err => res.send( err ));
});

module.exports = server;

//SERVER SETUP
const port = process.env.PORT || 4444;
server.listen( port , () => console.log( `\nAPI UP ON PORT ${port}\n` ));