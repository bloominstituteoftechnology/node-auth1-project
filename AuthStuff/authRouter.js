const router = require('express').Router()

const db = require('./authModel')

const {validateBody, validateUnique, validateUsername, hashPassword, validatePassword} = require('./auth-middleware')

router.post('/register', validateBody, validateUnique, hashPassword, (req, res) => {
    db.add(res.locals.user)
        .then(([id]) => {
            req.session.userId = id
            res.status(201).json({id})
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

router.post('/login', validateBody, validateUsername, validatePassword, (req, res) => {
    const {username, id} = res.locals.user

    req.session.userId = id
    res.json({message: `Hello ${username}`, id})
})

router.delete('/logout', (req, res) => {
    if (req.session) req.session.destroy()
    res.sendStatus(204)
})

module.exports = router