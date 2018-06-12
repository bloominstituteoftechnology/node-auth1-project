const router = require('express').Router();
const User = require('./userModel.js');

// Resource control Local Middleware
const protected = (req, res, next) => {
    if (req.session.username) { 
        next();
    } else {
        res.status(401).json('You shall not pass!');
    }
}

router.route('/')
    .get(protected, (req, res) => {
        User.find()
            .then(response => res.json(response))
            .catch(err => res.status(500).json({ error: err.message }));
})

module.exports = router;