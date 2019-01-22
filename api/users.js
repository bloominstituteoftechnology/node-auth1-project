const express = require('express'),
    router = express.Router(),
    db = require('../data/helpers/userModel.js'),
    bcrypt = require('bcrypt'),
    restricted = require('./middleware/restricted');


router
    .get('/', function (req, res) {
        db.get().then(user => {
            if (!user) return res.status(404).json({ message: "That user does not exist" });

            res.json(user);

        }).catch(err => res.status(500).json({ error: "There was an issue fetching the user.", info: err }));
    })

    .get('/:id', function (req, res) {
        db.get(req.params.id).then(user => {
            if (!user) return res.status(404).json({ message: "That user does not exist" });

            res.json(user);

        }).catch(err => res.status(500).json({ error: "There was an issue fetching the user." }));
    });

module.exports = router;