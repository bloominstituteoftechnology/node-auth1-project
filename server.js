const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('./data/db');

const port = 8002;
const server = express();

server.use(express.json());

server.listen(port, () => console.log(`Server is listening port ${port}`))

server.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>')
})

const session = require('express-session');

// configure express-session middleware
server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000, secure: false }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    secure: true, // only set cookies over https. Server will not send back a cookie over http.
    resave: false,
    saveUninitialized: false,
  })
);



// // ******  to hash a password *******

server.post('/api/register', (req, res) => {
    const info = req.body;
    const hash = bcrypt.hashSync(info.password, 10);
    info.password = hash;

    
        db('user')
            .insert(info)
            .then( ids => {
                db('user')
                .where({ id: ids[0]})
                .first()
                .then(user => {
                    req.session.userName = user.userName;
                    res.status(201).json(user)
                })
                .catch(err => res.status(500).json(err))
            })
})

server.post('/api/login', (req, res) => {
    const info = req.body;
    
        db('user')
            .where({ userName: info.userName })
            .first()
            .then(user => {
                if(user || bcrypt.compareSync(info.password, user.password)) {
                    req.session.userName = user.userName;
                    res.send(`welcome ${info.userName}`)
                } else {
                    return res.status(401).json({ error: 'Incorect credentials '});
                }
            })
            .catch(err => res.status(500).json(err))
})

server.get('/api/users', (req, res) => {
    if(req.session && req.session.userName) {
    db('user')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
    } else {
        return res.status(401).json({ error: 'Please login first to see this content'})
    }
});

// server.get('api/users', (req, res) => {
//     if(req.session && req.session.username === 'merry') {
//         db('users')
//         .then(u => {
//             res.status(200).json(u);
//         })
//         .catch(err => {
//             res.status(500).json(err)
//         })

//     } else {
//         return res.
//     }
// })

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
