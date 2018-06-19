const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/auth-i').then( () => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();
//middleware
const sessionOptions = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1000 * 60 * 60 //an hour
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',

};
//PROTECTED middleware
function protected(req, res, next) {
    if(req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({message: 'you shall not pass!!'});
    }
}
//.use is GLOBAL middleware
server.use(express.json());
server.use(session(sessionOptions));

//GET access to only logged in users using LOCAL middleware
server.get('/api/user', protected, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

//GET check if server is running
server.get('/', (req, res) => {
    if(req.session && req.session.username) {
        res.status(200).json({ message: `welcome back ${req.session.username}` });
    } else {
        res.status(401).json({message: 'speak friend and enter'});
    }
});

//GET array of all users if they are logged in
server.get('/api/users', ( req, res ) =>
{
User.find()
    .then( users =>
    {
    res.status( 200 ).json( users );
    } )
    .catch( err =>
    {
    res.status( 500 ).json( { error: 'Error' } )
    } );
} )

//POST Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
server.post('/api/register', (req, res) => {
    //save the user to the database

    //const user = new User(req.body);
    //user.save().then().catch;

    //or an alternative syntax would be:
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

//POST
server.post('/api/login', (req, res) => {
    //grab cradentials
    const { username, password } = req.body;
    //find the user to get access to the stored passsword
    User.findOne({ username })
    .then(user => {
        if (user) {
            //compare password guess to the stored password 
            user
                .validatePassword(password)
                .then(passwordsMatch => {
                    //the passwords math, user can continue
                    if(passwordsMatch) {
                        req.session.username = user.username;
                        res.send('have a cookie');
                    } else {
                        res.status(401).send('invalid credentials');
                    }
                    })
                    .catch(err => {
                        res.send('error comparing passwords');
                    });
        } else {
            //if not found
            res.status(401).send('invalid credentials');
        }
    }).catch(err => {
        res.send(err) 
    });
});

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
            res.send('error logging out');
        } else {
            res.send('good bye')
        }
        });
    }
});


server.listen(5000, () => {console.log('\n*** API running on port 5000***\n')})