const bcrypt = require('bcryptjs')

const router = require('express').Router()

const Users = require('../users/users-model')



router.post('/register', (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 12)
    user.password = hash;

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

router.post('/login', (req,res) => {
    let { username, password } = req.body

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                req.session.username = user
                res.status(200).json({ message: `Welcome ${user.username}`})
            } else {
                res.status(401).json({message : `invalid credentials`})
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

router.get('/logout', (req, res) => {
    if (req.session){
        req.session.destroy(error => {
            if(error){
                res.status(500).json({
                    message: 'your stuck'
                })
            } else {
                res.status(200).json({ message: 'logged out'})
            }
        })
    } else {
        res.status(200).end()
    }
})
module.exports = router