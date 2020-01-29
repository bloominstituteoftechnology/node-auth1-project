const router = require('express').Router();
const user = require('./authnModel');
const bcrypt = require('bcryptjs');



router.post('/register', (req, res) =>{
    const {username, password} = req.body;
    user.insert({username, password: bcrypt.hashSync(password, 9)})
        .then(id =>{
            res.status(201).json({message: 'user successfully registered', id});
        })
        .catch(err =>{
            console.log(err);
            res.status(500) .json({message: 'cannot complete request'});
        });
})

router.post('/login', (req, res) =>{
    const {username, password} = req.body;
    user.findByUsername({username, password: bcrypt.hashSync(password, 9)})
        .then(id =>{
            if(user && bcrypt.compareSync(password, user.password))
            res.status(200).json({message: 'user successfully logged in', id});
         else {
            res.status(400).json({message: 'hmm, something is wrong', id});
        }
        })

        .catch(err =>{
            console.log(err);
            res.status(500) .json({message: 'cannot complete request'});
        });
})




module.exports = router;