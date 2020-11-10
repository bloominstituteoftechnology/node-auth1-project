const router = require("express").Router();

const Users = require("./users-model.js");

function secure(req, res, next) {
    if ( req.session && req.session.user){
        next()
    }else {
        res.status(401).json({message: 'Unauthorized'})
    }
}

router.get("/", secure, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => res.send(err));
})

module.exports = router;