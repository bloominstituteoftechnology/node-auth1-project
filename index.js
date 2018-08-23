//Assignment:
// Part one, due Monday: Use Node.js, Express and Knex to build an API 
// that provides Register and Login functionality using SQLite to store 
// User information. Make sure the password is not stored as plain text.
// Part two, due Tuesday: Use sessions and cookies to keep a record of logged in users across requests.

const express = require('express');

const bycrypt = require('bcryptjs');

const knex = require('knex');

const knexConfig = require('./knexfile');

// We use the db constant to interact with our database.
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());



// // to hash a password
// const credentials = req.body;
// const hash = bcrypt.hashSync(credentials.password, 14);
// credentials.password = hash;

// //to verify a password
// const credentials = req.body;

// //find the user in the database by it's username then
// if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
//     return res.status(401).json({error: 'Incorrect credentials'});
// }

// // the user is valid, continue on


//Endpoints
// Method	Endpoint	    Description
// POST	    /api/register	Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
// POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'
// GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.

// Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
server.post('/api/register', (req,res) => {
    // //OPTION 1
    // const user = req.body;
    // // to hash a password
    // const credentials = req.body;
    // const hash = bcrypt.hashSync(credentials.password, 14);
    // credentials.password = hash;

    //OR

    //OPTION 2
    const {user, credentials} = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db.insert(user)
        .into('register')
        .then(ids => {
            res.status(201).json(ids[0]);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}
})

// POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. 
//                          On successful login, create a new session for the user and send back 
//                          a 'Logged in' message and a cookie that contains the user id. If login fails, 
//                          respond with the correct status code and the message: 'You shall not pass!'
server.post('/api/login', (req,res) => {

    //to verify a password
    const credentials = req.body;

    //find the user in the database by it's username then
    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({error: 'Incorrect credentials'});
    }

    // db.insert()

})











server.listen(8000, () => console.log('Running on port 8000'));