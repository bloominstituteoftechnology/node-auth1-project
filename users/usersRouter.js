const router = require('express').Router();

const User = require('./users.js');

//=========MIDDLEWARE=========
function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    }
    else {
        res.status(401).json({ message:'You Shall Not Pass!' })
    }
}

router.get('/', authenticate, (req, res) => {
    User
    .find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ error:'Could Not Get Users!' })
    })
})



module.exports = router;