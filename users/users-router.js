const express = require('express')
const bcrypt = require('bcryptjs')

const restricted = require('./restricted-middleware')

const router = express.Router()


router.post('/register', async (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash
    try {
      const user = await Users.add(user)
      res.status(201).json(user)  
    } catch(e) {
        res.status(500).json({ message: 'db error' })
    }
})

router.post('/login', async (req, res) => {
    let { username, password } = req.body
    try {
        const user = await Users.findBy({username}).first()
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user
            res.status(200).json({message: 'welcome to the jungle, ', username })
        } else {
            res.status(401).json({ message: 'wrong credentials' })
        }
    } catch(e) {
        res.status(500).json({ message: 'db error' })
    }
})

router.get('/', restricted, async (req, res) => {
    try {
        const users = await Users.get()
        if (users) { return res.status(200).json(users) }
        res.status(404).json({ message: 'get error' })
    } catch(e) {
        res.status(500).json({ message: 'db error' })
    }
})

router.get('/logout', restricted, async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send({ message: 'error logging out' })
        } else {
            return res.send({ message: 'sucessful log out' })
        }
    })
    res.end()
})

module.exports = router;