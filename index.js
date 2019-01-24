const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');

const db = require('./data/dbHelpers');
const PORT = 5050;

const server = express();

// custom middleware
function protect(req, res, next) {
    if(req.session && req.session.userId){
        next();
    } else {
        res.status(400).send('Access denied')
    }
}

server.use(express.json());
server.use(cors());
server.use(session({
        name: 'notsession', // default is connect.sid
        secret: 'nobody tosses a dwarf!',
        cookie: {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          //secure: true, // only set cookies over https. Server will not send back a cookie over http.
        }, // 1 day in milliseconds
        httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
        resave: false,
        saveUninitialized: false,
      })
);


server.post('/api/register', (req, res) => {
    const user = req.body;
    console.log('session', req.session)
    user.password = bcrypt.hashSync(user.password, 10);
    if(user.username && user.password){
        db.insertUser(user)
            .then(id => {
                res.status(201)
                    .json({id : id});
            })
            .catch(err => {
                res.status(500).send(err);
            })
    } else {
        res.status(400)
            .send({messge: "You must provide a username and password" })
    }
});

server.post('/api/login', (req, res) => {
    
    const creds = req.body;
    if(creds.username && creds.password){
        db.getUser(creds)
            .then(users => {
                if(users.length && bcrypt.compareSync(creds.password, users[0].password)){
                    // session is created
                    req.session.userId = users[0].id;
                    res.json({ info: "correct"})
                } else {
                    res.status(404).json({err: "Invalid username or password"})
                }
            })
            .catch( err => {
                res
                    .status(500)
                    .send(err);
            })
    } else {
        res.status(400)
            .send({message: "You must provide a username and password" });
    }
})

server.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            res.status(500).send('failed to logout')
        } else {
            res.send('logout successful');
        }
    })
})

server.get('/api/users', protect, (req, res) => {
    console.log('session', req.session)

    db.findUsers()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res
                .status(500)
                .send(err);
        })
      
})



 


server.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`)
});