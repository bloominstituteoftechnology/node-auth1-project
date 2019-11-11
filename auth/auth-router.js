const router = require('express').Router();
const bcrypt = require('bcryptjs')

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let userInfo = req.body;

    const hashedPassword = bcrypt.hashSync(userInfo.password, 12);
    userInfo.password = hashedPassword;

    Users.add(userInfo)
        .then(saved => {
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

module.exports = router;