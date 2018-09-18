// Requirements
const knex = require('knex');
const express = require('express');
const bcrypt = require('bcryptjs');
const knexConfig = require('./knexfile');
const session = require('express-session');
const cors = require('cors');
const KnexSessionStore = require('connect-session-knex')(session);

// Instantiations
const server = express();
const db = knex(knexConfig.development);

// Middleware


const sessionConfig = {
    name: 'monkey', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    })
  };


server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

// Endpoints
// server.get('/', (req, res) => {
//     res.status(200).send('Server is running!');
// });

server.get('/', (req, res) => {
    req.session.name = 'Frodo';
    res.send('got it');
});

server.post('/api/register', (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 8);

    creds.password = hash;

    db('users_table')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id);
        })
        .catch(err => {
            console.log('/api/register POST error:', err);
            res.status(500).send('Please try again later');
        });
});

server.post('/api/login', (req, res) => {
    //grab creds
    const creds = req.body;

    //find the user
    db('users_table')
    .where({username: creds.username})
    .first()
    .then(user => {
        //check creds
        if (user && bcrypt.compareSync(creds.password, user.password)){
            req.session.username = user.username;
            res.status(200).send(`Welcome ${req.session.username}`);
        } else {
            res.status(401).json({message: 'incorrect combination'});
        }
    }).catch(err => {
        console.log('/api/login Post error:', err);
        res.status(500).send(err, "Everything failed")});
})


server.get('/api/users', (req, res) => {
    
    if(req.session && req.session.username){

    
        db('users_table').select('id', 'username', 'password').then(users => {
            res.status(201).json(users);
        }).catch(err => {
            console.log("error:", err);
            res.status(500).json(err);
        })
    
        }else {
    
        res.status(401).json({message: 'Not authorized'});
        }

    
});

server.get('/api/admins', (req, res) => {
    // grab the logged in userid from the session
    if(req.session && req.session.userId){
    const userId = req.ession.userId;
    db('roles as r')
        .join('user_roles as ur', 'ur.role_id', '=', 'r.id')
        .select('r.role_name')
        .where('ur.user_id', userId)
        .then(roles => {
            if(roles.includes('admin') || roles.includes('boss')){
                //have access
            } else {
                //bounce
            }
        })
    }
    // query the db and get the roles or groups for the user


    // only send the list of users if the client is an admin
    if (req.session && req.session.role === 'admin'){
        db('users_table').select('id', 'username').then(users => {
            res.status(201).json(users);
        }).catch(err => {
            console.log("error:", err);
            res.status(500).json(err);
        })
        .catch(err => {
            console.log('error:', err)
            res.send(err)});

    } else {
        res.status(403).json({message: 'Not an Admin'});
    }
    
    
});

server.get('/greet', (req, res) => {
    const name = req.session.username;
    res.send(`hello ${name}`);
});




// Other Settings


const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}!`));