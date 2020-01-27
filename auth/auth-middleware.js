const Hub = require('../hub/users-model.js');
const bcrypt = require('bcryptjs');

function restricted(req, res, next) {
    const {username, password} = req.headers;
    if(username && password){
        Hub.findBy({username})
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                next();
            } else {
                res.status(401).json({message: 'Invalid Credentials'})
            }
        })
        .catch(err => {
            res.status(500).json({message: 'Unexpected error'})
        })
    } else {
        res.status(400).json({message: 'No credentials provided'})
    }
}

module.exports = restricted