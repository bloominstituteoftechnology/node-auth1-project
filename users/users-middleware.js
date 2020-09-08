const bcrypt = require('bcryptjs')
const Users = require('./users-model')

function restrict(){
    //put error message in variable so it can be re-used
    const authError = {
        message: "invalid credentials"
    }

    return async (req, res, next) => {
        try {
            // const { username, password } = req.headers
            // //make sure the values are not empty
            // if (!username || !password) {
            //     return res.status(401).json(authError)
            // }

            // const user = await Users.findBy({ username }).first()
            // //make sure the user exists in the database
            // if(!user) {
            //     return res.status(401).json(authError)
            // }
            
            // //compare the plain text password from the request body to the
            // //hash we have stored in the database. returns true or false.
            // const passwordValid = await bcrypt.compare(password, user.password)
            // //make sure password is correct
            // if(!passwordValid) {
            //     return res.status(401).json(authError)
            // }
            if(!req.session || !req.session.user) {
                return res.status(401).json(authError)
            }

            //if we reach this point, the user is authenticated!!!!!
            next()
        } catch (err){
            next(err)
        }
    }
}

module.exports = {
    restrict
}