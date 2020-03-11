const bcrypt = require('bcryptjs');
const Users = require('../user/user-model');

function restrict() {
    //lets store an error object in a variable to re-use it.
    const authError = {
        message: "Invalid credentials, boiii"
    }

    return async (req, res, next) => {
        try{
            const { username, password } = req.headers
            //make sure the values are not empty
            if(!username || !password) {
                return res.status(401).json(authError);
            }
            
            const user = await Users.findBy({ username }).first()
            //make sure the user exists
             if(!user) {
                 res.status(401).json(authError)
             }

             const passwordValid = await bcrypt.compare(password, user.password)
             //make sure the password is correct
             if(!passwordValid) {
                 return res.status(401).json(authError)
             }

             //if we've made it this far the user is authenticated!
             next()

        }catch(err) {
            next(err);
        }
    }
}

module.exports = restrict