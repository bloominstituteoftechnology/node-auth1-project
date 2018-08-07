const express = require('express')
const bcrypt = require('bcryptjs')
const session = require('express-session')

const db = require('./data/db')

const server = express()

server.use(express.json())

server.listen(3300, () => console.log('API running on port 3300'))


server.use(
    session({
        name: 'yeehaw',
        secret: 'Then after the show, it\'s the after party. And after the party, it\'s the hotel lobby.',
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000},
        httpOnly: true,
        secure: false,  // Set to true when not in development
        resave: true,
        saveUninitialized: false,   // to automatically set cookies
    })
)
server.get('/', (req, res) => {
    console.log("Hello")
    res.send("It's alive")
})

server.post('/api/register', (req, res) => {
    const credentials = req.body

    const hash = bcrypt.hashSync(credentials.password, 14)

     credentials.password = hash

     db('users')
        .insert(credentials)
        .then(function(ids) {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    res.status(201).json(user)
                })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
})

server.post('/api/login', (req, res) => {
    const credentials = req.body
    console.log("Credentials", credentials)
    
    db('users')
        .where({ userName: credentials.userName })
        .first()
        .then(user => {
            if(!user || !bcrypt.compareSync(credentials.password, user.password)){
                return res.status(401).json({error: "Incorrect Credentials"})
            }else{
                res.status(200).json(`Welcome ${user.userName}`)
            }
        })
        .catch( err => res.status(500).json(err.message))
})