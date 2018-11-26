const express = require('express');
const server = express();
const knex = require('knex')
const knexConfig = require('./knexfile');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = knex(knexConfig.development);
const KnexSessionStore = require('connect-session-knex')(session);


server.use(cors());
server.use(express.json())
server.use(session({
    name: 'site-sesh',
    secret: 'whatever.works',
    cookies: {
        maxAge: 1000*60*1,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        sidfieldname: "sid",
        tablename: 'sessions',
        knex: db,
        createTable: true,
        createInterval: 1000*60*2
    })

}))

server.use('/api/restricted/secrets', protected)

 server.get('/api/restricted/secrets/:id', function(req, res){
    const codeID = req.params.id
    const secret2 ='The universe is a phantasmagorical show.'
    const secret1 = 'The code to the safe is 123456farmersonly.com'

    console.log(codeID, 1)

    codeID == 1 ? res.status(200).json({message: secret1}) : //when I use codeID === 1 here it evaluates to false. Why?
    codeID == 2 ? res.status(200).json({message: secret2}) : 
    res.status(401).json({message: 'You\'re not authorized'})
    
});


server.post('/api/register', (req, res) =>{
    let user = req.body;
    if(user.password && user.username){
        let hash = bcrypt.hashSync(user.password, 12)
        user.password = hash;
        console.log(hash);
        db('users').insert(user)
        .then(user => res.status(201).json({user}))
        .catch(err => res.status(500).json({message: 'Error occurred while retrieving data.'}))
    }
    else{
        res.status(401).json({message: "Please enter both a username and password."})
    }
    
})

 server.post('/api/login', async (req, res) =>{
    let {password, username} = req.body;
    
    
    
    try{
        let user = await db('users').where({username: username}).first();
        
        if(user && bcrypt.compareSync(password, user.password) ){
            req.session.username = user.username;
            res.status(200).json({message: `Welcome, ${req.session.username}!`})
        }
        else{
            res.status(401).json({ message: 'Authentication failed.' });
        }
        
    }
    catch(err){
        res.status(500).json({err})
    }
});

 server.get('/api/users', protected, (req, res)=>{

        db('users')
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({message: 'Error occurred.'}))
});

function protected(req, res, next){
    if(req.session && req.session.username){
        next()
    }
    else{
        res.status(401).json({message: 'Please login to proceed.'})
    }
}



const port = process.env.PORT || 8888;
server.listen(port, ()=>console.log(`Server is listening on Port ${port}`))