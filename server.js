const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/cs10').then(() => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();

// middleware
const sessionOptions = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1000 * 60 * 60, // an hour
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
};

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: 'you shall not pass!!' });
    }
}

server.use(express.json());
server.use(session(sessionOptions));

server.get('/api/users', protected, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.status(200).json({ message: `welcome back ${req.session.username}` });
    } else {
        res.status(401).json({ message: 'speak friend and enter' });
    }
});

server.post('/api/register', (req, res) => {
    // save the user to the database

    // const user = new User(req.body);
    // user.save().then().catch;

    // or an alternative syntax would be:
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/api/login', (req, res) => {
    // grab credentials
    const { username, password } = req.body;

    // find the user to get access to the store password
    User.findOne({ username })
        .then(user => {
            if (user) {
                // compare password guess to the stored password
                user
                    .validatePassword(password)
                    .then(passwordsMatch => {
                        // the passwords match, the can continue
                        if (passwordsMatch) {
                            req.session.username = user.username;
                            res.send('have a cookie');
                        } else {
                            res.status(401).send('invalid credentials');
                        }
                    })
                    .catch(err => {
                        res.send('error comparing passwords');
                    });
            } else {
                // if not found
                res.status(401).send('invalid credentials');
            }
        })
        .catch(err => {
            res.send(err);
        });
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('good bye');
            }
        });
    }
});

server.listen(8000, () => {
    console.log('\n*** API running on port 8K ***\n');
});


// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');

// const User = require('./auth/UserModel');

// mongoose.connect('mongodb://localhost/auth-i', () => {
//     console.log('\n*** Connected to database **\n');
// })

// const server = express();

// // middleware
// const sessionOptions = {
//     secret: 'nobody tosses a dwarf!',
//     cookie: {
//         maxAge: 1000 * 60 * 60 // an hour
//     },
//     httpOnly: true,
//     secure: false,
//     resave: true,
//     saveUninitialized: false,
// };


// server.use(express.json());
// server.use(session(sessionOptions));

// function protected(req, res, next) {
//     if (req.session && req.session.username) {
//         next();
//     } else {
//         res.status(401).json({ message: 'you shall not pass!' })
//     }
// }

// server
//     .get('/api/users', protected, (req, res) => {
//     User.find()
//         .then(users => res.json(users))
//         .catch(err => res.json(err));
// });

// server
//     .get('/api/users', (req, res) => {
//         res.status(200).json({ api: 'running...' });
//     });

// server
//     .get('/', (req, res) => {
//     if (req.session && req.session.username) {
//         res.status(200).json({ message: `welcome back ${req.session.username}` });
//     } else {
//         res.status(401).json({ message: 'who are you?' });
//     }
// });

// server.post('/api/register', (req, res) => {
//     User.create(req.body)
//         .then(user => {
//             res.status(201).json(user);
//         })
//         .catch(err => {
//             res.status(500).json(err)
//         });
// })

// server.post('/api/login', (req, res) => {
//     const { username, password } = req.body
//     // find the user to get access to the store
//     // compare password guess to stored password
//     User
//         .findOne({ username })
//         .then(user => {
//             if (user) {
//                 user
//                     .validatePassword(password)
//                     .then(passwordMatch => {
//                         if (passwordsMatch) {
//                             req.session.username = user.username;
//                             res.send('logging successful');
//                         } else {
//                             res.status(401).send('invalid credentials');
//                         }
//                     })
//                     .catch(err => {
//                         res.send('error comparing passwords')
//                     })
//             } else {
//                 res.status(404).send('invalid credentials');
//             }
//         })
//         .catch(err => {
//             res.send(err)
//         })
// })

// server.get('/api/logout', (req, res) => {
//     if (req.session) {
//         req.session.destroy(err => {
//             if (err) {
//                 res.send('err logging out');
//             } else {
//                 res.send('good bye');
//             }
//         });
//     }
// });

// server.listen(8000, () => {
//     console.log('\n*** API running on port 8K **\n');
// })
