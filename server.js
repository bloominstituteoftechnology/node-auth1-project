const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

const User = require('./auth/UserModel');

mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost/auth').then(() => {
    console.log('\n***Connected to db ***\n');
});

const server = express();

const sessionOptions = {
    secret: 'this is my secret',
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname'
};

function forceShield(req, res, next){
    if (req.session && req.session.username){
        next();
    } else {
        res.status(401).json({message: 'Unfortunately, you may not enter.'})
    }
}

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session(sessionOptions));    


server.get('/', (req, res) =>{
    res.status(200).json({api: 'running....'})
});

server.post('/api/register', (req, res) => {
    User
    .create(req.body)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err =>{
        res.status(500).json({error: 'You could not register, please try again.'})
    })
})

server.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    User
    .findOne({username})
    .then(user => {
        if(user){
            user
            .validatePassword(password)
            .then(passwordMatch => {
                if(passwordMatch){
                    req.session.username = user.username
                    res.status(200).send({success: 'You are logged in!'})
                } else {
                    res.status(401).send('invalid credentials')
                }
            })
            .catch(err => {
                res.send('error comapring passwords')
            })
        }else {
            res.status(401).send('invalid credentials')
        }
    });
});

server.get('/api/users', (req, res) => {
    User
    .find()
    .populate()
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})


server.listen(5000, () => {
    console.log('\n***API running on port 5000***\n')
});