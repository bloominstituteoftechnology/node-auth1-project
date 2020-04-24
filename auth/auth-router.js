// Imports
const router = require('express').Router()
const bcrypt = require('bcryptjs')
// const authorize = require('./auth-middleware.js')
const Users = require('../users/user-model.js')

router.post('/register', (req, res) => {
    let user = req.body

    const hash = bcrypt.hashSync(user.password, 8)
    user.password = hash
    Users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
        })
})

router.post('/login', (req, res) => {
    let {username, password} = req.body

  Users.findBy({username})
            .first()
            .then(user => {
                console.log(req.session);
                if(user && bcrypt.compareSync(password, user.password)){
                    req.session.user = username;
                    res.status(200).json({ message: `welcome ${username}`})
                }
                else{
                    res.status(401).json({ messege: "Invalid Credentials" })
                }
            })
            .catch(err => {
                res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
            })
    })

    router.delete("/logout", (req, res) => {
        if (req.session) {
          req.session.destroy((err) => {
            if (err) {
              res.status(400).json("seems like there was an issue logging you out!");
            } else {
              res.json("You have been successfully logged out!");
            }
          });
        }
      });


module.exports = router
