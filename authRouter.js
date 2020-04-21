const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./data_model');

router.post('/register', (req, res) => {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 3);
    newUser.password = hash;


    Users.addUser(newUser).then(user => {
        
        if(newUser.username && newUser.password) {

            res.status(200).json('Thanks for creating an account you filthy animal')
        } else {
            res.status(404).json({message:'Read the fucking instructions'})
        }
    })
})
router.post('/login', (req, res) => {
   const {username, password} = req.body;
    
        Users.findByUser(username).then(user =>{
            
            if(user && bcrypt.compareSync(password, user.password)){
                req.session.loggedIn = true;
                console.log(req.session.loggedIn)
                return res.status(201).json(`welcome ${username}`)
            } else {
                return res.status(404).json("Oi, get outta my swamp")
            }
        })

})


module.exports = router;