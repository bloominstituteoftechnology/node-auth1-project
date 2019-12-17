const router = require('express').Router()

const db = require('./userModel')
const {validateSession} = require('./usermiddleware')

router.get('/', validateSession, (req, res) => {
    db.find()
        .then(resp => res.json(resp))
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

module.exports = router