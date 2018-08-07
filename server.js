const express = require('express');
const db = require('./data/db');

const session = require('express-session');
const bcrypt = require('bcryptjs');
const server = express();

server.use(express.json());

const protected = (req, res, next) => {
    console.log(req.session);
    if (!req.session.username) {
        res.status(401).json({message: "You're not authorized to view this content. Please login and try again."});
        return;
    }
    else {
        next();
    }
}

const roles = (req, res, next) => {
    return roles => {
        (!req.session.username)
        ? res.status(401).json({ error: "You're not authorized to view this content. Please login and try again."})
        : next();
    }
}

server.use(
    session({
        name: 'actualsession',
        secret: 'Snow White',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
        },
        secure: false, //for now; until moving to prod
        httpOnly: true, // don't let JS code access cookies; Browser extensions run JS code on your browser— this is the blanket reason why my brother would prevent JS from running on untrustworthy pages by default with a separate blocking extension.
        resave: false,
        saveUninitialized: true,
    })
);

server.get('/', (req, res) => {
    res.send(`8080's up and running.`);
});

server.get('/api', (req, res) => {
    res.send(`Hey, welcome to the API.`);
});

// POST | Register -- See that your registration goes through.

server.post('/api/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;
    
    db('users')
        .insert(user)
        .then(ids => {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    req.session.username = user.username;
                    res.status(201).json(user);
                });
        })
        .catch(err => {
            res.status(500).json({ err });
        })
});

// POST | Login -- See that your login is either successful or unsuccessful

server.post('/api/login', (req, res) => {
    const credentials = req.body;
    
    db('users')
        .where({ username: credentials.username })
        .first()
        .then(user => {
            // console.log(user, credentials);

            if (!credentials.password) {
                res.status(401).json({error: 'Missing credentials. Try again.'});
            }
            
            else if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.username = user.username;
                res.status(200).json({ message: `Welcome to the world, ${ user.username }!` }) 
            } 
            else {
                res.status(401).json({ error: 'Incorrect credentials. Try again.' });
            }
        })
        .catch(err => {
            res.status(500).json( err.message );
        })
});

// GET | See your users

server.get('/api/users', protected, (req, res) => {
    db('users')
    .then(users => {
        res.status(200).json({users});
    })
    .catch( err => {
        res.status(500).json({ err });
    })
})

server.get('/api/users/landing_page', protected, (req, res) => {
    // this is also protected
    res.send('You made it! Congratulations!');
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('Thank you for visiting! We hope to see you again, soon!');
        }
      });
    }
});

const port = 8080;
server.listen(port, function() {
    console.log(`Web API listening on http://localhost/${port} . . .`)
})


// // PUT | Login -- See that your login is either successful or unsuccessful

// server.put('/api/login', (req, res) => {
//     const credentials = req.body;
    
//     db('users')
//         .where({ username: credentials.username })
//         .then(user => {
//             console.log(user);
//             user[0] && bcrypt.compareSync(credentials.password, user[0].password) 
//             ? db('users')
//                 .where({ username: credentials.username })
//                 .update({loggedIn: 1})
//                 .then(success => {
//                     res.status(200).json({message: `Welcome to the world, ${ credentials.username }!`, user }) 
//                 })
//             : res.status(401).json({error: 'Incorrect credentials. Try again.'});
//         })
//         .catch(err => {
//             res.status(500).json( err.message );
//         })
// });

// // PUT | Logout -- See that your login is either successful or unsuccessful

// server.put('/api/logout', (req, res) => {
//     const { username } = req.body;

//     db('users')
//         .where({ username })
//         .first()
//         .update({ loggedIn: 0})
//         .then(user => {
//             res.status(200).json(`Okay, you've been successfully logged out! We'll see you next time, ${ username }!`)
//         })
//         .catch(err => {
//             res.status(500).json({ err });
//         })
// });
