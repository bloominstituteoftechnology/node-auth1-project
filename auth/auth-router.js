const router = require('express').Router();
const users = require('../users/users-model.js');
const bcrypt = require('bcryptjs');



// api/auth/register
router.post('/register', async (req, res, next) => {
    let user = req.body;
    let hash = bcrypt.hashSync(user.password, 10);

    user.password = hash;

    try {
        const saved = await users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        next({apiCode:500, apiMessage:'error registering', ...err})
        //this is basically saying res.status(500).json({message: 'server error}) we're just handling it through our errorHandler
    }

})

router.post('/login', async (req, res, next) => {
    let {username, password} = req.body;

    const [user] = await users.findBy({username});

    try {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user; //if logged in, create a session object
            res.status(200).json({message: `You're logged in under the username ${user.username}`})
        } else {
            next({apiCode:401, apiMessage:'You shall not pass'})
        }
        //essentially is the user exists, bcrypt will add the salt to the password guess, hash it, and then compare the results to the user.password we have stored already
    } catch (err) {
        next({apiCode:500, apiMessage:'error logging in', ...err})
    }
})

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                next({apiCode:400, apiMessage:'error logging out', ...err});
            } else {
                res.send('goodbye')
            }
        });
    } else {
        res.send('already logged out');
    }
});



module.exports = router;