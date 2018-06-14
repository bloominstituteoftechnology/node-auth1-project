const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const User = require('./auth/UserModel.js');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

server.use(
    session({
        secret: "secret1",
        cookie: {maxAge: 1 * 24 * 60 * 60 * 1000},
        httpOnly: true,
        secure: false,
        resave: true,
        saveUninitialized: false,
        name: 'none',
        store: new MongoStore({
            url: 'mongodb://localhost/sessions',
            ttl: 60 * 10
        })
    })
);

const restrictAuth = (req, res, next) => {
    if(req.path.startsWith('/restricted')){
        if(req.session ** req.session.username){
            next();
        }else{
            res.status(422).json({message: "This content is restricted to logged in users" })
        }
    } else{
        next();
    }
};
server.use(restrictAuth);

server.get(`/restricted/:username`, (req, res, next) => {
    const username = req.params.username;
    res.status(200).json({message: `Welcome to our VIP page, ${username}`})
})

mongoose.connect('mongodb://localhost/user')
    .then(() => {
        console.log('\n*** Connected to db***\n');
    })
    .catch(err => {
        console.log('\n***database connection failed***\n')
    })

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({api: "running well!"});
});

server.post('/register', (req, res) => {
    const newUser = new User(req.body);
    if(!newUser.username || !newUser.password){
        res.status(400).json({error: "Please provide both username & password."})
        return;
    }
    User.create(newUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

server.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username})
        .then(user => {
            console.log(req.session);
            if(user){
                user.isPasswordValid(password).then(isValid => {
                    if(isValid){
                        req.session.username = user.username
                        res.send('login successful');
                    } else {
                        res.status(401).send('invalid creds');
                    }
                })
            } else {
                res.status(401).send('invalid creds');
            }
        })
        .catch(err => res.status(500).send(err));
})

server.get('/users', (req, res, next) => {
    if(req.session.username){
        User.find()
            .then(users => {
                res.status(200).json(users);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    } else {
        res.status(401).json({error: "Please try again."});
    }
});

server.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err) {
                res.send('error logging out');
            }else {
                res.send('Goodbye!')
            }
        })
    }
})

server.listen(8001, () => {
    console.log('\n***API running on port 8001***\n');
});