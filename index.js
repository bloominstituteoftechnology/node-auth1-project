const express = require('express');
const db = require('./dbConfig');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session)

const app = express();
app.use(express.json());
app.use(cors());

const sessionConfig = {
    secret: 'savs+32mdsjkvnk',
    name: 'Voltaire',
    httpOnly: true,
    resave: false,
    saveUnitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 10
    },
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}
app.use(session(sessionConfig))

function protected(req, res, next) {
    if(req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({message: 'Not Authorized'})
    }
}

app.post('/api/register', (req, res) => {
 const creds = req.body;

 const hash = bcrypt.hashSync(creds.password, 16)

 creds.password = hash;

 db('users').insert(creds).then(ids => {
     res.status(201).json(ids)
 })
 .catch(err => json(err))

})

app.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users').where({username: creds.username}).first()
    .then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            res.status(200).json({message: 'Welcome!'})
        } else {
            res.status(401).json({message: 'Invalid!'})
        }
    })
    .catch(err => json(err));
})

app.get('/users', (req, res) => {
    db('users')
    .select('id', 'username')
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => json(err))
});
const PORT = 3500
app.listen(PORT, console.log(`==^_^== ${PORT} ==^_^==`));