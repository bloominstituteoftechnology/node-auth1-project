const bcrypt=require('bcryptjs');
const express = require('express');

const router = express.Router();

const Users=require("./users-model");



router.get('/hash', (req,res)=>{
    const authentication=req.headers.authentication;
  
  
    const hash=bcrypt.hashSync(authentication, 8);
  
  
    res.json({originalValue: authentication , hashedValue:hash})
})



//GET ALL USERS
router.get('/', (req, res) => {
    Users.find().then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        res.status(500).json({errorMessage:'Something Went Wrong'})
    })
});
//GET USER BY ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Users.findById(id).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        res.status(500).json({errorMessage:'Something Went Wrong'})
    })
});

//register
router.post('/register', (req, res) => {
    const usersInfo = req.body;
    const hash=bcrypt.hashSync(usersInfo.password, 8);
    usersInfo.password=hash;
    Users.insert(usersInfo).then(user=>{
        res.status(201).json(user);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({errorMessage:'Post Failed'})
    })
  })




router.post("/login", (req, res) => {
    let { username, password } = req.body;
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
        //   req.session.loggedIn = true;
        //   req.session.username = user.username; 
          res.status(200).json({message:'You\'re logged in!!!'});
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});


  
  //PUT (EDIT ACTION) 

router.put('/:id', (req, res) => {
    const actionInfo = req.body;
    const { id } = req.params;
    Users.update(id,actionInfo).then(user=>{
        res.status(201).json(user);
    }).catch(err=>{
        res.status(500).json({errorMessage:'ERROR'})
    })
  });
  

//DELETE ACTION 
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Users.remove(id).then(user=>{
        res.status(201).json(user);
    }).catch(err=>{
        res.status(500).json({errorMessage:'FAILED TO DELETE'})
    })
});


  
  module.exports = router;