const router = require('express').Router();
const bcrypt = require('bcryptjs')

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let userInfo = req.body;

    const hash = bcrypt.hashSync(userInfo.password, 12);
    userInfo.password = hash;

    Users.add(userInfo)
        .then(saved => {
            req.session.username = saved.username;
            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            //checking to see if the pswrd is valid
            if(user && bcrypt.compareSync(password, user.password)) {
                req.session.username = user.username;
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'You shall not pass!' })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({ message: 'You are stuck.' })
            }
            res.status(200).json({ message: 'Logged out successfully.' })
        });
    } else {
        res.status(200).json({ message: 'Bye Felicia!' })
    }
})

module.exports = router;