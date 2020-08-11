const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/user-model.js')

router.get('/', (req, res) => {
    const user = req.body;
})

router.post('/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
    .then (saved => {
        res.status(201).json(saved);
    })
     .catch (error => {
        res.status(500).json(error);
    });
});



router.post('/login', (req, res) => {
    let {username, password } = req.body;

    Users.findBy({username})
    .first()
    .then(user => {
        if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` })
        } else {
            res.status(401).json({ message: 'Invalid Credentials'});
        } 
    })
        .catch (error => {
            res.status(500).json(error);
        });
    });
    

router.delete('/logout', (req, res) => {
    if (req.session) {
        
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'Could Not Loggout:', error: err });
            } else {
                res.json({ message: 'Bye-Bye For Now!' });
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;