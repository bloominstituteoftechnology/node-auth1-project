const express = require('express');
const data = require('../models/dataModel.js');
const router = express.Router();
const bcrypt = require('bcryptjs');

const middleware = require('../config/routeMiddleware.js');
router.use(middleware.restricted);

router.post('/register', (req, res)=>{
    const hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    const {username, password} = req.body;
    const user = {username, password};
    data.register(user)
        .then(ids =>{
            const id = ids[0];
            res.status(201).json({newUserId: id});
        })
        .catch(err => res.status(500).json(err.message));
});

router.post('/login', (req, res)=>{
    const {username, password} = req.body;
    const credentials = {username, password};
    data.login(credentials)
        .then(user=>{
            if(user){
                if(bcrypt.compareSync(credentials.password, user.password)){
                    req.session.username = user.username;
                    res.status(200).json({welcome: user.username});
                }else{
                    res.status(401).json({message:'Username and password do not match.'});
                }
            }else{
                res.status(400).json({message:'Username not found.'});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

router.get('/users', middleware.protected, (req, res)=>{
    data.getUsers()
        .then(users=>{
            if(users.length>0){
                res.status(200).json(users);
            }else{
                res.status(400).json('No users in database.');
            }
        })
        .catch(err => res.status(500).json(err.message));
});

router.get('/user-info', (req, res)=>{
    const username = req.session.username;
    if(username){
        data.getUserInfo(username)
            .then(user=>{
                res.status(200).json(user);
            })
    }else{
        res.status(400).json({message: 'Restricted access.'});
    }
});

router.get('/greet', (req, res)=>{
    const name = req.session.username;
    if(name){
        res.status(200).send({message:`Hello ${name}.`});
    }else{
        res.status(400).json({message:`Please log in.`});
    }
});

router.get('/logout', (req, res)=>{
    if(req.session){
        req.session.destroy(err =>{
            if(err){
                res.send('error logging out');
            }else{
                res.send('Seent you again!');
            }
        });
    }
});

router.get('/restricted/test', (req, res)=>{
    res.json('Nice!');
});

module.exports = router;