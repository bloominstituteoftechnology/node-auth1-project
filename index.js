const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// const knex = require('knex');
// const dbConfig = require('./knexfile');
// const db = knex(dbConfig.development);

const db = require('./data/dbHelpers.js');

const server = express();

const port = 5555;

server.use(express.json());
server.use(cors());
server.use(session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day IN MILLISECONDS 
    },
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  }));

//to create a new user account:
server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 16);
    db.insert(user)
        .then(response => {
            res.status(201).json({id: response[0]});
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: 'Failed to create new user. Please try again.'})
        });
});

//to login into current user account:
server.post('./api/login', (req, res) => {
    const bodyUser = req.body;
    db.findByUsername(bodyUser.username)
        .then(response => {
            if(response.length && bcrypt.compareSync(bodyUser.password, response[0].password)) {
                req.session.userID = users[0].id;
                res.status(200).json({info: 'correct'});
            } else {
                res.status(404).json({error: "incorrect username OR password. Please try again."});
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: 'Problem with login page. Please try again later. Sorry for the inconvenience.'});
        });
});

//page that loads AFTER a successful login has been completed:
server.get('./api/accounts', (req, res) => {
    if (req.session && req.session.userID) {
        db('accounts').select('username', 'password')
            .then(response => {
                console.log(response);
                res.json(response);
            })
            .catch(error => {
                console.log(error);
                res.json({error: 'unable to load accounts. please try again.'});
            });
    } else {
        res.status(400).json({ERROR: 'access denied'})
    }
});


server.listen(port, () => {
    console.log(`Server at Port ${port} is up an running!`)
});