// https://github.com/LambdaSchool/auth-i/pull/298

const express = require('express');
const session = require('express-session');
const SessionStore = require('connect-session-knex')(session);
const cors = require('cors'); 
const bcrypt = require('bcryptjs');
const db = require('./dbConfig.js');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(session({
    name:'session',
    secret:'big secret',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
        tableName: 'users',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    })
}));

app.get('/',(req,res)=>{
    res.send('Running...');
});

app.post('/api/register', (req,res)=>{
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            let id = ids[0];
            res.status(201).json(id);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

app.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({name:creds.name})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)){
                req.session.name = user.name;
                res.status(201).json({message: `Come on in, ${req.session.name}`});
            } else {
                res.status(401).json({message: 'You shall not pass....'});
            }
        })
        .catch(err => {
            console.log(`Error ${err}`);
            res.status(500).json({message:`Somethin ain't right, here.`});
        })
});

app.get('/api/users', (req, res)=>{
        db('users')
            .select('name', 'password')
            .then(users => {
                res.status(200).json(users)
            })
            .catch(err => {
                req.status(500).json(`There's been a problem retrieving users`)
            })
});

app.listen(PORT, ()=>{console.log(`Running server on ${PORT}`);});