const Hub = require('../hub/users-model.js');

function restricted(req, res, next) {
    if(req.session && req.session.loggedIn){
        // Hub.findBy({username})
        // .then(user => {
        //     if(user && bcrypt.compareSync(password, user.password)){
        //         next();
        //     } else {
        //         res.status(401).json({message: 'Invalid Credentials'})
        //     }
        // })
        // .catch(err => {
        //     res.status(500).json({message: 'Unexpected error'})
        // })
        next();
    } else {
        res.status(401).json({message: 'Nope'})
    }
}

module.exports = restricted