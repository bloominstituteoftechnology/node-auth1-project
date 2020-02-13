const users = require('../routers/user-model');
const bcrypt = require('bcryptjs');

module.exports = (req, res, next) => {

const {username, password} = req.headers;

if(!(username && password)){
    res.status(404).json({message: 'please enter correct creditentials'})
} else {
    users.findBy({username})
    .first()
    .then(myuser => {
        if (myuser && bcrypt.compareSync(password, myuser.password)){
            next()
        } else {
            res.status(401).json({message: 'incorrect creditentials'})
        }
    }).catch(err => {
        res.status(500).json({message: err})
    })
}








}