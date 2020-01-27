const router = require('express').Router();
const Users = require('../users/users-model.js');

router.get("/", (req,res)=>{
    res.json(`Api is working`)
})
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
     
      if (user && password) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});



module.exports = router;