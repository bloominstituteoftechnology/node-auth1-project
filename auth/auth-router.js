const router = require('express').Router();
const users = require("../users/users-model");
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res, next) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    try {
     const saved = await users.add(user);
     res.status(201).json(saved);
    } catch  (err) {
        next({ apiCode: 500, apiMessage: 'Error restistering', ...err });
    }
});

router.post('/login', async (req, res, next) => {
    let {username, password} = req.body;

    try {
        const [user] = await users.findBy({username});
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;  // this brings in our session
            console.log('added user to req.session!');
            res.status(200).json({ message: `Welcome ${user.username}!, have a cookie!` });
        } else {
            next({ apiCode: 401, apiMessage: "Invalid credentials" });
        }
    } catch (err) {
            next({ apiCode: 500, apiMessage: ' Error logging in', ...err });
    }
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                next({ apiCode: 400, apiMessage: "Error logging out", ...err });
            } else {
                res.send('So long & thanks for playing!');
            }
        });  
    } else {
        res.send('Already logged out!');
    }
});


module.exports = router;