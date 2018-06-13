const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const User = require('./users/User.js');

const loginRouter = require('./loginRouter')
const userRouter = require('./users/userRouter')

mongoose.connect('mongodb://localhost/users').then(() => {
    console.log('\n*** Connected to database ***\n')
})

const server = express();


server.use(express.json());
server.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true 
}))

server.use(session({ 
    secret: "ifIg1v3mYc4t3nuFScr1TCh3sM4yBeHEWIllL34vEMyN0t3s470N3",
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    saveUninitialized: false,
    resave: true,
    name: 'none',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
    })
}))


const sendUserError = (status, message, res) => {
    res.status(status).json({ error: message });
    return;
}

// server.get('/', (req, res, next) => {
//     if (req.session && req.session.username) {
//         res.send(`Welcome back ${req.session.username}`)
//     } else {
//         res.send(`Who are you?  Who?`)
//     }
//     res.status(200).json({ api: 'running...' })
// })

// function authenticate(req, res, next) {
//     if (req.session && req.session.username) {
//         next()
//     } else {
//         res.status(401).send('You shall not pass!!!')
//     }
// }

server.get('/view-counter', (req, res) => {
    const session = req.session
    if (!session.viewCount) {
        session.viewCount = 0;
    }
    session.viewCount++;
    res.json({ viewCount: session.viewCount })
})

// server.post('/api/register', (req, res) => {
//     User.create(req.body).then(user => {
//         res.status(200).json(user)
//     }).catch(err => res.status(500).json(err))
// })

// server.post('/api/login', (req, res) => {
//     let password = req.body.password
//     let username = req.body.username
//     if (!password || !username) {
//        sendUserError(400, err.message, res)
//     } else {
//         User.findOne({ username })
//         .then(user => {
//             if (user) {
//                 user.isPasswordValid(password).then(isValid => {
//                     if (isValid) {
//                         req.session.username = user.username;
//                         res.status(200).json('Logged in')
//                     } else {
//                         res.status(401).send('You shall not pass!')
//                     }
//                 })
//             } else {
//                 sendUserError(401).send('You shall not pass!')
//         }}).catch(err => sendUserError(500, err.message, res)
//     )}
// })

// server.get('/api/users', authenticate, (req, res) => {
//     User.find().then(users => res.send(users))
// })

// server.get('/api/logout', (req, res) => {
//     if (req.session) {
//         let name = req.session.username
//         req.session.destroy(function(err) {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.send(`Goodbye, ${name}, ye shall be missed`)
//             }
//         })
//     }
// })
server.use('/api', loginRouter);
server.use('/api/restricted', userRouter);

server.listen(8000, () => { console.log('\n*** API running on port 8K ***\n')})