//IMPORTS
const Users = require( '../users/userModel' ); 
const bcrypt = require('bcryptjs');

//MIDDLEWARE
function restricted( req , res , next ) {
    const { username , password } = req.headers;
    if ( username && password ) {
        Users.findBy({ username })
            .first()
            .then( user => {
                if (user && bcrypt.compareSync( password , user.password )) {
                    next();
                } else {
                    res.status( 401 ).json({ message: 'Invalid Credentials' });
                }
            })
            .catch(error => {
                res.status( 500 ).json({ message: 'Unexpected Server error', error });
            })
    } else {
        res.status( 500 ).json({ message: 'No Creds Provided' });
    }
}

//EXPORTS
module.exports = restricted;