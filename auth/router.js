
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const User = require('../user/userModel');


// Register
router.post('/register', (req, res) => {

    const userData = req.body;

    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userData.password, ROUNDS);

    userData.password = hash;

    User.add(userData)
        .then(user => {
            res.json(user);
        })
        .catch(err => res.send(err));
});

// Login
router.post('/login', (req, res) => {
    
    const {username, password} = req.body;

    User.findBy({ username })
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)){
                req.session.user = {
                    id: user.id,
                    username: user.username,
                };
                res.status(200).json({ Hello: user.username})
            }   else {
                res.status(401).json({ Error: 'Your username or password is incorrect.' })
            }
        })
    .catch(error => {
        res.status(500).json({ Error: 'User does not exist.'})
    })
});

// Logout
router.get('/logout', (req,res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error){
                res.status(500).json({ message: 'Logout Failed '});
            }   else {
                res.status(200).json({ message: 'Logged out Successfully.' })
            }
        });
    }   else {
        res.status(200).json({ message: 'You have already logged out.' })
    }
})

module.exports = router;