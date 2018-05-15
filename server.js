const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./users/User');

mongoose
    .connect('mongodb://localhost/authenticatedb')
    .then(conn => {
        console.log('\n== connected to mongoDB')
    })
    .catch(err => {
        console.log('error connecting to mongo', err)
    })

const server = express();

// authen = (req, res, next) => {
//     User
//         .find({ username: req.body.username })
//         .then(users => {
//             const userPassword = users[0].password;
//             bcrypt.compare(req.body.password, userPassword, (err, result) => {
//                 if (result) next();
//                 else res.send('wrong password')
//             });
//         })
// }

authen = (req, res, next) => {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('Try again later :(');
    }
}

const sessionConfig = {
    secret: 'im a wizard',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
    secrue: false,
    resave: true,
    saveUnintialized: false,
    name: 'jekm\'s cookie',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
    }),
};

server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
    if (req.sessions && req.session.username) {
        res.send(`welcome back ${req.session.username}`);
    } else {
        res.send('wrong url, sorry');
    }
});

server.get('/api/users', authen, (req, res) => {
    User
        .find()
        .then(users => res.status(200).send(users))
        .catch(err => res.status(500).send(err));
});

server.post('/api/register', (req, res) => {
    const user = new User(req.body);

    user
        .save()
        .then(user => res.status(200).send(user))
        .catch(err => res.status(500).send(err, console.log(err)));
});

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            user.isPasswordValid(password)
                .then(valid => {
                    if (valid) {
                        console.log(user)
                        req.session.username = user.username
                        res.send('login successful');
                    }
                    else res.status(401).send('bad creds');
                })
        })
        .catch(err => res.status(401).send('bad cred score'));
})

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(function(err) {
            if(err) res.send(err);
            else res.send('Come back again!');
        });
    }
});

const port = 5000;
server.listen(port, () => console.log(`\n=== API running on ${port} ===\n`));