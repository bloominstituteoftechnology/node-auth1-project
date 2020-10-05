const router = require('express').Router();
const users = require('../users/user-model');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res, next) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    try {
        const saved = await users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        next({apiCode:500, apiMessage:"error registering", ...err})
    }
})

router.post('/login', async (req, res, next) => {
    let {username, password} = req.body;

    try {
        const [user] = await users.findBy({username});
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json({ message: `Logged In, User: ${user.id}`});
        } else {
            next({ apiCode:401, apiMessage: "You shall not pass!", ...err });
        }
    } catch (err) {
        next({ apiCode:500, apiMessage: "error logging in", ...err });
    }
});


module.exports = router;