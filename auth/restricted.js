//IMPORTS
const bcrypt = require('bcryptjs');
const Users = require( '../users/userModel' ); 

//MIDDLEWARE
module.exports = ( req , res , next ) => {
    if ( req.session && req.session.user ) {
        next();
    } else {
        res.status( 401 ).json({ message: 'You cant pass, sorry not sorry 🦄' });
    }
}