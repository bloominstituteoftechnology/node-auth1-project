const router = require('express').Router();
const Users = require('../users/users-model');

router.post('/', async (req, res) => {
    let user = req.body;

    try {
        const saved = await Users.addUser(user);
        res.status(201).json(saved);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;