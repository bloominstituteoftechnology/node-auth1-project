const express = require('express')
server = express()
User = require('./models/user')
mongoose = require('mongoose')
bcrypt = require('bcrypt')
session = require('express-session')
helmet = require('helmet')
cors = require('cors')
MongoStore = require('connect-mongo')(session)

server.use(helmet())
server.use(cors())
server.use(express.json())

mongoose.connect('mongodb://localhost/cs10')

// global middleware initialising a session w/ secret key, adds session to the req object and saves the session into the db
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: `RANDOM STRING WILL BE IN HERE!`,
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    name: 'noname',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// global middleware that is dynamic and can be used to protect whatever route we want to
const protected = function (req, res, next) {
    console.log(req.session)
    req.session.username && req.session ? next() : res.status(401).json({ error: "Please login to view this site" })
}

// middleware protecting /restricted and subroutes
server.use('/api/restricted', protected, (req, res, next) => {
    next()
})

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.status(200).json({ message: `welcome back ${req.session.username}` });
    } else {
        res.status(401).json({ message: 'speak friend and enter' });
    }
});

// Register here: 
server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json({ error: err.message }))
    // save the user to the db
})
// Login here: 
server.post('/api/login', function (req, res) {
    let { username, password } = req.body
    User.findOne({ username })
        .then(result => {
            result
                .validatePassword(password)
                .then(passwordsMatch => {
                    if (passwordsMatch) {
                        req.session.username = result.username;
                        res.send('have a cookie')
                    } else {
                        res.status(401).send('invalid credentials')
                    }
                })
            //sets properties in the session for this user

            // return res.status(200).send('Succesfully logged in!')

        })
})
// protected by global middleware is our users resource
server.get('/api/users', protected, (req, res) => {
    User.find({}, { username: 1, _id: 0, password: 1 })
        .then(result => res.status(200).json({ result }))
        .catch(err => res.status(500).json({ error }))
})

server.get('/api/logout', ((req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            err ? console.log(err.message) : res.send('good bye')
        })
    }
}))

server.listen(8000, () => {
    console.log('\n *** API running on port 8000 ***\n')
})