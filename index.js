//Questions when is the cookie created? 
//how could I create another cookie? 

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);


const db = require('./db/db.js');

const server = express();

const sessionConfig = {
    name: 'dont call this session',
    secret: 'keep this a secret',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 10 * 1000, 
        secure: false, 
    },
    httpOnly: true, 
    resave: false, 
    saveUninitalized: false, 
    // the store allows the session to be saved on the database instead of in the memory on the server. so if the server restarts it still keeps track of the session. 
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    }),
};

server.use(express.json());

server.use(cors({
    credentials: true, 
    orgin: 'http://localhost:3000'
 }));


server.use(session(sessionConfig));


server.use(helmet());

// function use(req, res, next){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


function protected(req, res, next){
    console.log(req.session)
    if (req.session && req.session.username){ 
        // rew.session.username is def the problem 
        //idk how to verify the username
        next();
    } else {
        res.status(401).json({message: 'you are not authorized, please login'})
    }
}

server.get('/users/', protected, (req, res) => {
    db('users')
    .then(users => {
        res.status(201).json(users);
    }).catch(err => res.status(500).send(err))
})

server.post('/login/', (req,res) => {
    const creds = req.body;
    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            console.log(user.username)
            if(user && bcrypt.compareSync(creds.password, user.password)){
                
                req.session.username = user.username;//this is the first place that the session is created? 
                console.log(req.session.username)
                res.status(200).send(`welcome ${req.session.username}!`);
            } else {
                res.status(401).json({message: "not authorized"})
            }
            // const id = ids[0];//cause it return a single array?
        }).catch(err => res.status(500).send(err))
})

server.use('/use/restricted', protected, (req, res) => {
    if (req.session.username){
        next();
    } else {
        res.status(401).json({message: 'no!'})
    }
})

server.get('/use/restricted/other', (req, res) => {
    res.status(200).json({messge: " this is restricted"})
})

server.get('/', (req, res) => {
    res.status(200).json({message: "server is running"})
})

server.post('/register/', (req,res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 3);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0]; //cause it return a single array?
            res.status(201).json(id);
        }).catch(err => res.status(500).send(err))
})


server.get('/logout/', (req,res) => {
    if (req.session) {
        req.session.destroy(err => {
           if (err) {
           res.send('err logging out')
           } else {
           res.send('you are now logged out')
        }
        })
    }
})



server.get('/setname', (req, res) => {
    req.session.name = 'Frodo';
    res.send('got it');
  });
  
  server.get('/greet', (req, res) => {
    const name = req.session.username;
    res.send(`hello ${name}`);
  });
  

server.get('/cookie', (req, res) => {
    res.status(200).send(req.session.username)
})

server.listen(4500, () => {console.log('\n === server running on 4500 === \n')})