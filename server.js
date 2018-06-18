const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('./UserModel');



mongoose.connect('mongodb://localhost/auth-i').then( () => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
});

router
.route( '/api/register' )
server.get( ( req, res ) =>
{
userSchema.find()
    .then( users =>
    {
    res.status( 200 ).json( users );
    } )
    .catch( err =>
    {
    res.status( 500 ).json( { error: 'Error' } )
    } );
} )


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