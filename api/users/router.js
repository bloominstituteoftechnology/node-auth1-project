const express = require("express");
const router = express.Router();

const authorize = () => (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(500).json({
            message: "You shall not pass!",
            session: req.session,
        });
    }
};

router.get("/users", authorize, async (req, res) => {
    await Users.get()
        .then((users) => {
            res.status(200).json({ users: users, session: req.session });
        })
        .catch((err) => {
            res.status(400).json({
                message: "You shall not pass!",
            });
        });
});

module.exports = router;
