const express = require('express');
const server = express();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const knex = require('knex');
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

server.use(express.json());
server.use(cors());

const sessionConfig = {
    name: 'authentication',
    secret: 'lambda-school',
    cookie: {
        maxAge: 1 * 1000 * 60 * 60 * 24,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
}

server.use(session(sessionConfig));

//middleware
function protected ( req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({
            message: "You shall not pass!"
        });
    };
};

server.get('/setname', (req, res) => {
    req.session.name = 'Francis';
    res.send('Logged');
});

server.get('/greet', (req, res) => {
    const { name } = req.session;
    res.send(`Hello, ${name}`);
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy( err => {
            if ( err ) {
                res.send('error logging out')
            } else {
                res.send('see you again!')
            }
        })
    }
});

server.post('/api/register', async ( req, res ) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync( credentials.password, 5 )
    credentials.password = hash;
    if ( !credentials.username || !credentials.password ) {
        res.status(400).json({
            message: "Username and password are required."
        })
    } else {
        try {
            const newUser = await db('users').insert( credentials );
            res.status(201).json( newUser );
        }
        catch ( err ) {
            res.status(500).json( err.message );
        };
    };  
});

server.post('/api/login', async ( req, res ) => {
    const credentials = req.body;
    try {
            const user = await db('users')
                                .where({ username: credentials.username })
                                .first()
            if ( bcrypt.compareSync( credentials.password, user.password ) ) {
                req.session.username = user.username;
                res.status(200).json({
                    message: "Logged in."  
                });
            } else {
                res.status(400).json({
                    message: "You shall not pass!"
                });
            }
    }
    catch (err) {
        res.status(500).json( err.message );
    };
});

server.get('/api/users', protected, async ( req, res ) => {
    try {
        const users = await db('users').select('id', 'username', 'password');
        res.status(200).json( users )
    }
    catch ( err ) {
        res.status(500).json( err.message );
    };
});

const port = 8000;
server.listen( port, () => console.log(`===Server is running on port ${port}===`))
