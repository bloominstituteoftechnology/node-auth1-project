const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

 


router.post('/login', (req,res) => {
  let{username, password}= req.body;

  Users.findBy({username})
  .first()
  .then(user=> {
      if(user && bcrypt.compareSync(password, user.password)){
          console.log("SESSION",req.session)
           req.session.user = user;
          console.log('USER',user)
          res.status(200).json({message: `Welcome ${user.username}!`});
      }else{
          res.status(401).json({message: 'Invalid Credentials'})
      }
  })
  .catch(err=> {
      res.status(500).json({message: "can't log in."});
  });
});
router.get('/logout', (req,res)=>{
  if(req.session){
    req.session.destroy(err => {
      if(err){
        res.send(' you can check out any time you like, but you can never leave')
      }else{
        res.send('bye, thanks for all the fish.')
      }
    })
  }else{
    res.status(200).json({message: 'logged out'})
  }
})

module.exports = router;
