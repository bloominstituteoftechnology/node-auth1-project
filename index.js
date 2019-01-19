const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const restrictedRoutes = require('./restrictedRoutes');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(session({
    name: 'notsession',
    secret: 'Thats eighty hundred',
    cookie:{
        maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
}));

server.use('/api/restricted', restrictedRoutes);

server.post('/api/register', (req, res)=>{
    const user = req.body;
    if(user.username && user.password){
        user.password = bcrypt.hashSync(user.password);
        db('users')
        .insert(user)
        .then(ids=>{
            res.status(201).json({id: ids[0]});
        })
        .catch(error=>{
            res.status(500).json({error: 'Failed to add user'});
        })
    }
    else{
        res.status(400).json({errorMessage: 'Please include a username and password'});
    }
})

server.post('/api/login', (req, res)=>{
    const user = req.body;
    if(user.username && user.password){
        db('users')
        .where('username', user.username)
        .then(users=>{
            if(users.length && bcrypt.compareSync(user.password, users[0].password)){
                req.session.userId = users[0].id;
                res.json({info: `Welcome ${user.username}`});
            }
            else{
                res.status(404).json({errorMessage: 'Invalid username or password'});
            }
        })
        .catch(error=>{
            res.status(500).json({error: 'Failed to find user'});
        })
    }
    else{
        res.status(400).json({errorMessage: 'Please include a username and password'});
    }
})

server.post('/api/logout', (req, res)=>{
    req.session.destroy(error=>{
        if(error){
            res.status(500).json({errorMessage: 'Logout Failed'});
        }
        else{
            res.json({info: 'Logged Out'});
        }
    })
})

server.get('/api/users', (req, res)=>{
    if(req.session && req.session.userId){
        db('users')
        .select('id', 'username')
        .then(users=>{
            res.json(users);
        })
        .catch(error=>{
            res.status(500).json({error: 'Failed to return users'})
        })
    }
    else{
        res.status(401).json({errorMessage: 'Access Denied'});
    }
})

server.listen(3300, ()=>console.log('Starting server'));

