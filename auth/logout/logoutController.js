const router = require('express').Router();

router.route('/').get((req, res) => {
    if (req.session.username) {
        req.session.destroy(err => {
            if (err) {
                res.json({ message: `Error logging out.`})
            } else {
                res.json({ message: `You have logged out.`})
            }
        })
    } else {
        res.json({ message: `You are not logged in.`})
    }
});

module.exports = router;