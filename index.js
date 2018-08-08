const express = require('express')
const bcrypt = require('bcryptjs')
const session = require('express-session')

const db = require('./data/db')

const server = express()

server.use(express.json())

server.listen(3300, () => console.log('API running on port 3300'))


// ***************** MiddleWare to Authenticate User ***********************

const getUser = (req, res, next) => {
    let { userName } = req.body
    try{
        db('users')
            .where({ userName })
            .first()
            .then(user => {
                if(user){
                    req.userIn = user
                    console.log("User line 25", user)
                    next()
                }else{
                    res.status(500).json("Error with user name or password")
                }
            })
    }catch(err){
        res.status(500).json("Error with user name or password")
    }
    
}

server.use(
    session({
        name: 'yeehaw',
        secret: 'After the party, its the hotel lobby',
        cookie: { 
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: false,  // Set to true when not in development
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: true,   // to automatically set cookies
    })
)

server.get('/', (req, res) => {
    console.log("Hello")
    res.send("It's alive")
})

server.post('/api/register', (req, res) => {
    const credentials = req.body

    const hash = bcrypt.hashSync(credentials.password, 10)

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

server.post('/api/login', getUser, (req, res) => {
    const passwordIn = req.body.password
    const user = req.userIn

    if(bcrypt.compareSync(passwordIn, user.password)){
        req.session.userName = user.userName
        res.status(200).json(`Welcome ${user.userName}`)
    }else{
        return res.status(401).json({error: "Incorrect Credentials"})
    }
})

// server.get('/api/users', (req, res) => {
//     if(req.session && req.session.username === )
// })