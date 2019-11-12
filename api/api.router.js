const bcrypt = require('bcryptjs')
const router = require('express').Router();
//npm install bcryptjs

const Users = require('../users/users-model')


const authRouter = require('../auth/auth-router')
const usersRouter = require('../users/users-router')
const restrictRouter = require('../restricted/restricted')

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/restricted', restrictRouter)

router.get('/', (req, res) => {
    res.json({ api: "api router" });
  });



router.post('/hash', (req, res) => {
    //read password from body
    const password = req.body.password
    console.log(password)
    //hash the password using bcryptjs
    const hash = bcrypt.hashSync(password, 8);
    console.log(hash)
    // return it to the user in an object that looks like
  // { password: 'original passsword', hash: 'hashed password' }
  res.status(200).json({password, hash});

})

// router.get('/restricted', (req, res) => {
//     Users.find()
//       .then(users => {
//         res.json(users);
//       })
//       .catch(err => res.send(err));
//   });

  
//   //middleware takes req, res, next
//   function protected(req, res, next){
//     let {username, password} = req.headers
//      if 
//     (username && password){
//       Users.findBy({username})
//       //database queries return an array, but we are looking for an object, use .first()
//       .first()
//       .then(user => {
//         if(user && bcrypt.compareSync(password, user.password)){
//           next()
//         } else {
//         res.status(401).json({message: 'You cannot pass'})
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error)
//     })
//     } else{
//       res.status(400).json({message: 'please provide creditials'})
//     }
//   }



module.exports = router