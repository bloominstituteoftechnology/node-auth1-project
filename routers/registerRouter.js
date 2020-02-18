const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./user-model');

router.post("/", (req, res) => {
    let user = req.body;
    console.log(user)
  //   hash = [version][cost][salt][hash]
    const hash = bcrypt.hashSync(user.password, 10);
    console.log(hash)
    user.password = hash;
  
    Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    
    }).catch(err => {
        res.status(500).json({message: err})
    })
  
  });







module.exports = router;