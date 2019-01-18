const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

const server = express();

server.use(express.json());
server.use(session(
    {
        name: 'notsession',
        secret: 'nobody tosses a dwarf',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
    }
));

function protector(req, res, next){
    if(req.session && req.session.userId){
        next();
    }else{
        res.status(400).send('access denied');
    }
}

server.get('/api/users', protector, (req, res) =>{
    db('users') 
        .select('id', 'username')
        .then(users => {
            res.json(users);
        })
    .catch(() =>{
        res.status(500).json({message: 'You shall not pass'})
    })    
})

server.post('/api/register', (req, res) =>{
    const newUserInfo = req.body;
    newUserInfo.password = bcrypt.hashSync(newUserInfo.password);
    db('users').insert(newUserInfo)
    .then(ids =>{
        res.status(201).json({id: ids[0]})
       //console.log(newUserInfo.password)
    })
    .catch(() =>{
        res.status(500).json({message: 'Trouble creating new user'})
    })
})

server.post('/api/login', (req, res) =>{
    const userBody = req.body;
    db('users').where('username', userBody.username)
        .then(users =>{
            if(users.length && bcrypt.compareSync(userBody.password, users[0].password)){
                req.session.userId = users[0].id;
                res.json({message: 'Correct combination of username and passcode. You may pass my dude!'})
            }else{
                res.status(404).json({message: 'Invalid username or password'})
            }
        })
        .catch(() =>{
            res.status(500).json({message: 'Could not log in'})
        })    
});

server.post('/api/logout', (req, res) =>{
    req.session.destroy(err =>{
        if(err){
            res.status(500).send('Could not log out')
        }else{
            res.send('Successful logout');
        }
    })
})


server.listen(5000, () =>{
    console.log('Server is up and running!');
})
