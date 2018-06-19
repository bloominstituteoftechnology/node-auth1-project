const express = require('express');
const mongoose = require('mongoose');
const User = require('./auth/UserModel');



mongoose.connect('mongodb://localhost/auth-i').then( () => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();

server.use(express.json());

//GET check if server is running
server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
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

//POST
server.post('/api/login', (reg, res) => {
    //grab cradentials
    const { username, password } = req.body;
    //find the user to get access to the stored passsword
    user.findOne({ username: username })
    .then(user => {
        if (user) {
            //compare password guess to the stored password
            User.validatePassword(password)
            .then(passwordsMatch => {
                //the passwords math, user can continue
                if(passwordsMatch) {
                    res.send('log in successful');
                } else {
                res.send('invalid crentials');
                }
                })
                .catch(err => {
                    res.send('error comparing passwords');
                });
        } else {
            //if not found
            res.status(404).send('user not found');
        }
    }).catch(err => {
        res.send(err) 
    });
});


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

server.listen(5000, () => {console.log('\n*** API running on port 5000***\n')})