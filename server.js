const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session')

//import the knex store library
const KnexSessionsStore = require('connect-session-knex')(session);

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

const sessionConfig = {
    name: 'session_name',
    secret: 'this is a secret',
    cookie: {
        maxAge: 1*24*60*60*1000, //milliseconds in a day
        secure: false,
    },
    httpOnly: true, //restrict the type of code that can access this, no javascript
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionsStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000*60*60,
    }),
};

server.use(session(sessionConfig));

server.use(helmet());
server.use(express.json()); // don't forget this
server.use(cors());

//Here we create some custom middleware to use locally to control access to certain resources based on user login status
function protected(req,res,next){
    if(req.session && req.session.username){
        next();
    }else{
        res.status(401).json({message: "You do not have clearence"});
    }
}

//start server
server.get('/', (req, res) => {
res.send('API Running...');
});

server.post('/api/register', (req,res) => {
    //retrieve credentials
    const creds = req.body;

    //hash the password
    const hash = bcrypt.hashSync(creds.password, 12)

    //replace user password with the hash
    creds.password = hash;

    //save the user
    db('users').insert(creds)
    .then(ids => {
        const id = ids[0];
        res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err))
});

server.post('/api/login', (req,res) => {
    const creds = req.body;

    db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)){
            res.status(401).send('Welcome, You may now access your account');
        }else{
            res.status(401).json({message: 'Your credentials were not entered correctly'});
        }
    })
    .catch(err => res.status(500).send(err));
});

//protect the route so that only authenticated users can see it
server.get('/api/users', (req,res) => {
    db('users')
    .select('id', 'username','password')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(9000, () => console.log('\n running on port 9000\n'));