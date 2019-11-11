const router = require('express').Router();

const Users = require('./users-model.js')
const requiresAuth = require('../auth/requires-auth-middleware.js')

router.get('/', requiresAuth, (res, req) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(error => res.send(error));
});

module.exports = router;