const router = require('express').Router();

const User = require('../../data/user/userModel.js');

router.route('/').post((req, res) => {
    User.create(req.body)
        .then(response => res.status(201).json(response))
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;