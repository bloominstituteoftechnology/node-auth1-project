const express = require("express");
const router = express.Router();
const User = require("../users/model");

router.post("/", async (req, res) => {
    let { username, password } = req.body;

    try {
        let user = await User.findBy({ username });
        if (user[0] && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json({
                message: 'Logged in',
                user: user,
                session: req.session,
            });
        } else {
            res.status(400).json({ error: 'You shall not pass!' });
        }
    } catch (err) {
        res.status(400).json({ error: 'You shall not pass!'});
    }
});

module.exports = router