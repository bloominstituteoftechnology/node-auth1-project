const express = require('express');
const session = require('express-session');
const knex = require('knex'); 
const cors = require('cors'); 
const sqlite3 = require('sqlite3'); 
const bcrypt = require('bcryptjs');
const db = require('./dbConfig.js');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(session({
    name:'ijusdunno',
    secret:'dunno isnt all bad',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
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
                res.session.name = user.name;
                res.status(201).json(`Come on in, ${res.session.name}`);
            } else {
                res.status(401).json({message: 'You shall not pass....'});
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

app.listen(PORT, ()=>{console.log(`Running server on ${PORT}`);});