const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./user-model');

router.post("/", (req, res) => {
    let user = req.body;
  
  //   hash = [version][cost][salt][hash]
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
  
    Users.add(user)
    .then(completed => {
        res.send(completed)
    }).catch(err => {
        res.status(500).json({message: err})
    })
  
  });






module.exports = router;