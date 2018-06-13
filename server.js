const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};

server.use(express.json())
server.use(cors(corsOptions));

server.use(
    session({
        secret: 'en buyuk fener',
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
        httpOnly: true,
        secure: false,
        saveUninitialized: false,
        resave: true,
        name: 'noname',
        store: new MongoStore({
            url: "mongodb://localhost/sessions",
            ttl: 60 * 10
        })
    })
)

const User = require('./users/userModel')

const restrictAuth = (req, res, next) => {
    if (req.path.startsWith("/restricted")) {
        if (req.session && req.session.username) {
            next();
        }else{
            res.status(422)
                .json({ message: "This content is restricted to logged in users" });
        }
    } else {
        next();
    }
};

server.use(restrictAuth);


server.get(`/restricted/:username`, (req, res, next) => {
    const username = req.params.username;
    res.status(200).json({
        message: `Welcome to special ${username} page restricted to VIP users`
    });
});

mongoose.connect('mongodb://localhost/user')
        .then(() => {
            console.log(`\n=== Connected to database=== \n`)
        })
        .catch(err => {
            console.log('database connection failed')
        })




server.get('/', (req, res) => {  
    if(req.session && req.session.username) {
        res.json({message: `welcome back ${req.session.username}`})
    }else {
    res.json({api: 'running'})}
})

server.post('/register', (req,res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(400).json({ error: "Please provide both username and password for the user." });
        return;
    }
    User.create(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            console.log('database connection failed')
        })
})

server.post('/login', (req,res) => {
    const { username, password} = req.body;
    User.findOne( { username })
        .then(user => {
            if(user) {
                // bcrypt.compare(passwordGuess, user.password) => {
                user.isPasswordValid(password).then(isValid => {
                    if(isValid) {
                        req.session.username = user.username
                        res.send('login successful, have a cookie')
                    }else {
                        res.status(401).send('invalid credentials');
                    }
                })
            }else {
                res.status(401).send('invalid credentials')
            }
        })
        .catch(err => res.status(500).send(err));
})

server.get("/users", (req, res, next) => {
      if (req.session.username) {
            User.find()
                  .then(users => {
                        res.status(200).json(users);
                      })
                  .catch(error => {
                        res.status(500).json(error);
                      });
          } else {
            res.status(401).json({ error: "You shall not pass" });
          }
    });



server.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('Good bye, please come back again!');
            }
        });
    }
});


server.listen(5000, () => {
    console.log(`\n=== Api running on port 5000 ===\n`)
})

