const bcrypt = require('bcryptjs')

const Users = require('../users/users-model')

module.exports = (req, res, next) => {
    let {username, password} = req.headers //not from body so works on get

    if (username && password) {
        Users.findById({username})
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)){
                    next()
                } else {
                    res.status(401).json({message: 'Invalid Credentials'})
                }
            })
            .catch(error=> {
            console.log('login error', error)
            res
                .status(500)
                .json({message: 'ran into an error, try later'})
            })
        }else{
            res.status|(400).json({message: 'please provide credentials'})
        }
}