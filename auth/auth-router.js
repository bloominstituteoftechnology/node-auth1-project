const router = require('express').Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model.js')

router.get('/', (req, res) => {
    res.json({ api: "auth-router" });
  });

router.post('/register', (req, res) => {

    let credentials = req.body
  console.log(`post`,req.body)
    //hash password
    const hash = bcrypt.hashSync(credentials.password, 8)
    credentials.password = hash

    Users.add(credentials)
        .then(saved => {
            //after registration will be logged in
            req.session.username = saved.username
            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error)
        })
    })


router.post('/login', (req, res) => {
    let {username, password} = req.body

    Users.findBy({username})
     .first()
     .then(user => {
         //check that password is valid
         if(user && bcrypt.compareSync(password, user.password)){
             req.session.username = user.username //adding cookie to exsisting object
             res.status(200).json({message: `Welcome ${user.username}`})
         } else {
             res.status(401).json({message: 'Invalid Credentials'})
         }
     })
     .catch(error => {
        console.log('login error', error);
        res.status(500).json(error);
      });
})

router.get("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(error => {
        if (error) {
          res
            .status(500)
            .json({
              message:
                "you can check out any time you like, but you can never leave..."
            });
        } else {
          res.status(200).json({ message: "logged out successfully" });
        }
      });
    } else {
      res.status(200).json({ message: "by felicia" });
    }
  });


module.exports = router