const express = require('express')
const Users = require('./user-model.js')
const needLogin = require('../restrictions/restricted.js')
const router = express.Router()
const bcrypt = require('bcryptjs')

router.get('/', needLogin, async (req, res) => {
    const found = await Users.find()
    try {
        if (found) {
            res.status(200).json(found)
        } else {
            res.status(401).json('No Users to Display')
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
})

router.post('/Register', async (req, res) => {
    const login = req.body
    const hash = await bcrypt.hashSync(login.password, 12)
    login.password = await hash
    try {
        const newLogin = await Users.addUser(login)

        if (newLogin) {
            res.status(201).json('New User added')

        } else {
            res.status(404).json('Unable to add new User')
        }
    }
    catch{
        res.status(500).json('Error with Database')
    }
})

router.post('/Login', async (req, res) => {
    let { username, password } = req.body

    try {
        const user = await Users.findBy({ username }).first()
        //getting hashed password using compareSync
        if (user && bcrypt.compareSync(password, user.password)) {

            //store session as user
            req.session.user = user;

            res.status(200).json({ message: `Welcome ${user.username}` })
        } else {
            res.status(401).json({ message: 'Invalid Cred' })
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/Logout', (req, res) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                res.status(400).json({ message: 'Unable to Logout!!' })
            } else {
                res.json({ message: 'See you next time.' })
            }
        })
    } else {
        res.end()
    }
})


module.exports = router