const router = require('express').Router();

const User = require('./users.js');

router.post('/', (req, res) => {
    const { username, password } = req.body;

    User
    .findOne({ username })
    .then(user => {
        if (user) {
            user
            .isPasswordValid(password)
            .then(isValid => {
                if (isValid) {
                    req.session.username = user.username;
                    res.send('Logged In');
                }
                else {
                    res.status(401).json({ message:'You Shall Not Pass!' })
                }
            });
        }
        else {
            res.status(401).json({ message:'You Shall Not Pass!' });
        }
    })
    .catch(err => {
        res.status(500).json({ error:'You Shall Not Pass!' })
    })
})


module.exports = router;