const router = require('express').Router();
const users = require('../users/users-model.js');


// api/auth/register
router.post('/register', async (req, res, next) => {
    let user = req.body;

    try {
        const saved = await users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        next({apiCode:500, apiMessage:'error registering', ...err})
        //this is basically saying res.status(500).json({message: 'server error}) we're just handling it through our errorHandler
    }

})



module.exports = router;