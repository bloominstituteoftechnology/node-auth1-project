//Assignment:
// Part one, due Monday: Use Node.js, Express and Knex to build an API 
// that provides Register and Login functionality using SQLite to store 
// User information. Make sure the password is not stored as plain text.
// Part two, due Tuesday: Use sessions and cookies to keep a record of logged in users across requests.

const express = require('express');

const session = require('express-session');

const bcrypt = require('bcryptjs');

const knex = require('knex');

const knexConfig = require('./knexfile');

// We use the db constant to interact with our database.
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());

// This middleware verifies that we have a session and that the userId is set. We could use username or any other value we can use to verify access to a resource.
function protected(req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  }


server.use(
    session({
        name: "bloop sesh", 
        secret: "bleep bleep", //this won't be in production code. for development, OK.
        cookie: {
            maxAge: 1*24*60*60*1000, //one day in milliseconds. Server will not send back a cookie over http.
            secure:false //only set cookies over https QQQQQ????: Why did prof change this from true to false?
        } , 
        httpOnly: true,  //don't let JS code access cookies. Browser extensions run JS code on your browser!
        resave: false, 
        saveUninitialized:true // QQQQQ????: Why did prof change this from false to true?
    })
)

server.get('/setname', (req, res) => {
    req.session.name = 'bleep';
    res.send('done');
})

server.get('/getname', (req,res) => {
    const name = req.session.name;
    res.send(`hello ${req.session.name}`);
})

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

    const user = req.body; 

    //hash password
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    db('users')
        .insert('user')
        .then(ids => {
            db('users')
                .where({id: ids[0]})
                .first()
                .then(user => {
                    res.status(201).json(user);
                });
        })
        .catch(err => res.status(500).json({err}));
})




// POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. 
//                          On successful login, create a new session for the user and send back 
//                          a 'Logged in' message and a cookie that contains the user id. If login fails, 
//                          respond with the correct status code and the message: 'You shall not pass!'
server.post('/api/login', (req,res) => {

    //to verify a password
    const credentials = req.body;
    
    db('users')
        .where({username:credentials.username})
        .first()
        .then(function(user) {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.username = user.username;
                res.send(`welcome ${user.username}`);
            } else {
                return res.status(401).json({error: 'Incorrect credentials'});
            }
        })
        .catch(error => {
            res.status(500).json({error});
        })

     //  // from tk notes
    // //find the user in the database by it's username then
    // if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
    //     return res.status(401).json({error: 'Incorrect credentials'});
    // }

    // db.insert()

})



// GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.

server.get('/api/users', (req, res) => {
    if (req.session && req.session.username)
    db('users')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
})







server.listen(3300, () => console.log('Running on port 3300'));