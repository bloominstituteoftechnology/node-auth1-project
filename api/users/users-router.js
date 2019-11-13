const router = require('express').Router()

const db = require('./users-model')
const {validateSession} = require('./users-middleware')

router.get('/', validateSession, (req, res) => {
    db.find()
        .then(resp => res.json(resp))
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

module.exports = router