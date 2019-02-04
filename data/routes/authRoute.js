const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const middleWare = require('../middleware/middleware')

const db = require('../helpers/db')


router.use(middleWare.useSession)


//endpoints
router.post('/register', (req, res) => {
  const creds = req.body //grab username/password
  console.log(creds)
  const hash = bcrypt.hashSync(creds.password, 12) // hash password
  creds.password = hash
  console.log(creds)
  db.register(creds)
    .then(id => {
      res
        .status(201)
        .json(id)
    })
    .catch(err => {
      res
        .status(500)
        .json({message: 'registration failed'})
    })
})

router.post('/login', (req, res) => {
  const creds = req.body
  console.log(creds)

  db.login(creds.user_name)
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.user = user;
        res
          .status(201)
          .json({message: 'Welcome'})
      } else {
        res
          .status(401)
          .json({message: 'You shall not pass!'})
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({message: 'Login Failed'})
    })
})

module.exports = {
  protected: (req, res, next) => {
    if(req.session && req.session.user) {
      next()
    } else {
      res
        .status(401)
        .json({message: 'Not logged in'})
    }
  }
}



module.exports = router,{protected: (req, res, next) => {
  if(req.session && req.session.user) {
    next()
  } else {
    res
      .status(401)
      .json({message: 'Not logged in'})
  }
},};