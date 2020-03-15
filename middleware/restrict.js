const bcrypt = require("bcryptjs")
const Users = require('../users/users-model')



// first thing we have to do is get the username and password value from the header
// second thing we want to do is make sure those values aren't empty.
function restrict(){
    // put in "error message" variable so we can re-use it
    const authError = {
        message: "Invalid credentials",
    }

    return async (req, res, next) => {
        try {
            const { username, password } = req.headers
            // make sure the values aren't empty but writing an if statement
            // if there is no username of password
            // then return a 401 status
            if (!username || !password) {
                return res.status(401).json(authError)
            }

            // next thing we need to do is get the user from the database
            // import user's model up top
            const user = await Users.findBy({ username }).first()

            // make sure the user exists
            //if that user is undefined, return an error
            if (!user){
                return res.status(401).json(authError)
            }

            const passwordValid = await bcrypt.compare(password, user.password)

            // make sure the password is correct
            if (!passwordValid) {
                return res.status(401).json(authError)
            }

            // if we reach this point, the user is authenticated!
            next() // next will allow us to move on to the next middleware function. 
        } catch(err) {
            next(err)
        }
    }
}

module.exports = restrict