const express = require('express');
const bcrypt = require('bcryptjs')
const session = require('express-session')
const server = express();
const DB = require('./data/dbHELPER.js')

server.use(express.json())
server.use(session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    }, 
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  }))

const PORT = 4444;

server.get('/api/users', (req, res) => {
    if (req.session && req.session.userID){
        DB.get()
    .then(info => {
        res.json(info)})
        .catch(err => {
            res.status(500).json({err: `${err} Something went wrong`})
        })
    }
    else {res.status(400).json({message: `Not logged on!`})}})

server.post('/api/register', (req,res) => {
    const user = req.body;

    user.password = bcrypt.hashSync(user.password,14) 
    const missing = ['username', 'password', 'registered'].filter(item => {return user.hasOwnProperty(item) === false})
    if(missing.length===0)
    {DB.insert(user)
    .then(ids => {
        res.status(201).json(res.json({message: `user ${user.username} added`}))})
    .catch(err => {
        res.status(500).json({err: `Could not add user! ${err}`})
    })
    }

    else {res.status(500).json({message: `missing info: ${missing}`})}
    })

    server.post('/api/login', (req,res) => {
        
        const user = req.body;
        
        DB.findByUsername(user.username)
        .then(users => {
            if (users && bcrypt.compareSync(user.password, users[0].password)){
                req.session.userID = users[0].id;
                res.json({message: `Success!`})}
            else {
                res.status(404).json({message: `invalid username or password`})
            }})
        .catch(err => {
            res.status(500).json({message: `Could not login`})
        })})

        server.post('/api/logout', (req,res) => {
        
            req.session.destroy(err => {
                if (err) {
                    res.status(500).json({message: `Failed to logout!`})
                }
                else {
                    res.status.json({message: `Logged out successfully!`})

                }
            })
           })

server.listen(PORT, (err) => {
    if (err) {console.log(err)}
    else {console.log(`listening on port ${PORT}`)}
})