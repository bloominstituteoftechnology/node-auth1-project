const router = require('express').Router();
const User = require('../../data/user/userModel.js');

const protected = (req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.status(401).json('You shall not pass!');
    }
}

router.all('/*', protected);

router.route('/users')
    .get((req, res) => {
        User.find()
            .then(response => res.json(response))
            .catch(err => res.status(500).json({ message: err.message }));
    });

router.route('/otherusers')
    .get((req, res) => {
        User.find()
            .then(response => res.json(response))
            .catch(err => res.status(500).json({
                message: err.message
            }));
    });

module.exports = router;