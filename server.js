const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);


const server = express();

server.use(
  session({
    name: "notsession", // default is connect.sid
    secret: "nobody tosses a dwarf!",
    cookie: { 
        maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
        secure: false, // only set cookies over https. Server will not send back a cookie over http.
    resave: false,
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    saveUninitialized: true,
  })
);

server.use(express.json());


server.get('/', (req, res, next) => {
    res.send('Welcome')
})

server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send(`hello ${req.session.name}`);
});


server.post('/api/register', (req, res, next) => {
    const user = req.body;
    //hash pw
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    //post to db
    db('users')
        .insert(user)
        .then(response => {
            res.status(200).json({
                Message: 'You have succesfully registered!'
            })
        })
        .catch(err => {
            res.status(500).json(err);
        })
})



server.post('/api/login', (req, res, next) => {
    //get credentials from req
    const credentials = req.body;
    //query db
    db('users')
        .where({
            username: credentials.username
        })
        .first()
        .then(function (user) {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            if (req.session.username != 'admin'){
            res.redirect('/users')
            }else {
                res.redirect('./restricted/edit_users')
            }

            } else return res.status(401).json({
                error: 'Forbidden: Incorrect login information'
            }).catch(err => {
                res.status(500).json({
                    err
                });
            })
            //continue...

        })
})

//this route sends back just the list of usernames.
server.get('/api/users', (req, res, next) => {
    db('users')
        .then(response => {
            let userArray = [];
            response.map(users => {
                userArray.push(users.username)
            })
            res.status(200).json({
                users: userArray
            })
        })
})

//restricted route sends back all user information to 'admin'
server.get('/api/restricted/edit_users', (req, res, next) => {
    if (req.session && req.session.username === 'admin') {
        db('users')
            .then(response => {
               res.status(200).json({response})
            })
    } else {
        res.status(403).json({
            error: 'Access Denied, wrong permissions'
        })
    }
})



const port = 8000;
server.listen(port, () => {
    console.log(`server running on port ${port}`)
});