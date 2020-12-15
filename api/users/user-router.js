const router = require('express').Router();
const Users = require('./user-modal');


const restricted = (req, res, next) => {
    if(req.session && req.session.user) {
        next()
    } else {
        res.status(401).json('Unauthorized')
    }
};

router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(e => res.send(e.messager))
});

module.exports = router;