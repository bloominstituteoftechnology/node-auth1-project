const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./user-methods.js');

router.get('/', (req, res) => {
    res.status(200).json({ message: `IT'S WORKING! IT'S WORKING!!!` });
});

router.post('/register', (req, res) => {
    let userInfo = req.body;
    console.log(userInfo);
    userInfo.password = bcrypt.hashSync(userInfo.password, 12);
    
    Users.add(userInfo)
        .then(id => {
            res.status(201).json(id);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    let { username, password } =  req.body;

    Users.findByUser(username)
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Hello, ${user.username}!` });
            } else {
                res.status(401).json({ message: 'User credentials invalid!'});
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;