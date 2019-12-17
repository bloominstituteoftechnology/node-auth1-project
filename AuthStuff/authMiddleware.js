const bcrypt = require('bcryptjs')

const db = require('./authModel')

function validateBody(req, res, next) {
    if (!req.body) return res.status(400).json({ message: 'Missing json body.' })
    const { username, password } = req.body
    if (!username || typeof username != 'string') return res.status(400).json({ message: 'Missing field: username.' })
    if (!password || typeof password != 'string') return res.status(400).json({ message: 'Missing field: password.' })
    res.locals.user = { username, password }
    next()
}

function validateUnique(req, res, next) {
    const username = res.locals.user.username
    db.find({ username })
        .then(user => {
            if (user) res.status(409).json({ message: 'That username is already taken. Please try a different username.', username })
            else next()
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
}

function hashPassword(req, res, next) {
    const password = res.locals.user.password
    bcrypt.hash(password, 15, (err, hash) => {
        if (err) {
            console.error(err)
            res.sendStatus(500)
        }
        else {
            res.locals.user.password = hash
            next()
        }
    })
}

function validateUsername(req, res, next) {
    const username = res.locals.user.username
    db.find({ username })
        .then(user => {
            if (user) {
                res.locals.user.hash = user.password
                res.locals.user.id = user.id
                next()
            }
            else res.status(401).json({ message: 'You shall not pass!' })
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
}

function validatePassword(req, res, next) {
    const { password, hash } = res.locals.user
    bcrypt.compare(password, hash, (err, match) => {
        if (err) {
            console.error(err)
            res.sendStatus(500)
        }
        else {
            if (match) next()
            else res.status(401).json({ message: 'You shall not pass!' })
        }
    })
}
module.exports = { validateBody, validateUnique, validateUsername, hashPassword, validatePassword } 
