const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/dbHelpers');
const session = require('express-session');
const cors = require('cors')


const server = express();
const PORT = 5000;

server.use(express.json());
server.use(cors());
server.use(session(
    {
      name: 'notsession', // default is connect.sid
      secret: 'nobody tosses a dwarf!',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000
      }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false,
      saveUninitialized: false,
    }
  ));

function protect(req, res, next) {
    if(req.session && req.sesion.userId) {
        next();
    } else {
        res.send('access denied')
    }
};



server.get('/', protect, (req, res) => {
    db.getUsers()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({err: 'error getting users'})
    })
});

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 14);

    if(user.username && user.password) {
        db.addUser(user)
        .then(id => {
            res.status(201).json({id: id[0]});
        })
        .catch(err => {
            res.status(500).json({err: 'error adding new user'})
        })
    } else {
        res.status(400).json({err: 'username or password missing'})
    }
});

server.post('/api/login', (req, res) => {
    const user = req.body;

    db.findUser(user.username)
    .then(userInfo => {
        if(userInfo.length && bcrypt.compareSync(user.password, userInfo[0].password)) {
                req.session.userId = userInfo.id[0];
                res.json({message: 'Logged in'})
            } else {
                res.status(404).json({err: 'username or password incorrect'})
            }
        })
    .catch(err => {
        res.status(500).json({err: 'error logging in'})
    })
});

server.post('/api/logout', (req, res) => {
    req.session.destroy(err  => {
        if(err) {
            res.send('failed to logout')
        } else {
            res.send('logout successful')
        }
    })
})


server.listen(PORT, () => {
    console.log(`listenig on port ${PORT}`)
})