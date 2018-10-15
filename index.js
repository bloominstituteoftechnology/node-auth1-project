/// ---- Node Dependencies ----
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

/// ---- Instantiate Express Server ----
const server = express();

/// ---- Connect Middleware ----
server.use(express.json(), helmet());

/// ---- Instantiate Database ----
const db = require('./data/expressDb');

///// ---------- CRUD Enpoints ----------
// Sanity Check CRUD Endpoint
server.get('/', (request, response) => {
    response.send(`IT'S ALIVE!!!`)
})

/// ---- CREATE User Endpoint ----
server.post('/authenticate', (request, response) => {
    // Deconstruct Request Body
    let { username, password } = request.body;

    // Regular Expression for Password Validation
    const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/g;

    // Request Validation
    if (!username || !password) {
        return response.status(400).json(
            { errorMessage: "Please provide a password and username when creating a new user." }
        )}
    if (username.length < 3) {
        return response.status(400).json(
            { errorMessage: "Username must be at least 4 characters long." }
        )}
    if (password.length < 11) {
        return response.status(400).json(
            { errorMessage: "Password must be at least 12 characters long." }
        )}
    if (!password.match(passwordRegex)) {
        return response.status(400).json(
            { errorMessage: "Password must contain one uppercase letter, one lowercase letter, and one number, with no spaces." }
        )}

    // Hash Password
    const hash = bcrypt.hashSync(password, 14)
    password = hash;
    
    // Construct Credentials Object
    const credentials = { username, password }

    // Database Promise Methods
    db('user')
    .insert(credentials)
    .then(ids => {
        if (!ids || ids.length < 1) {
            return response.status(400).json(
                { errorMessage: "Unable to create a user with the provided username and password" }
            )
        }
        let id = ids[0];
        response.status(201).json(
            { createdUserId: id }
        )
    })
    .catch(error => {
        if (error.errno === 19) {
            return response.status(500).json(
                { errorMessage: "A user already exists with the specified username." }
            )
        }    
        response.status(500).json(error);
    });
});


/// ---- CREATE Login Session Endpoint ----
server.post('/login', (request, response)  => {
    // Deconstruct Request Body
    const { username, password } = request.body;

    // Request Validation
    if (!username || !password) {
        return response.status(400).json(
            { errorMessage: "Please provide a password and username when attempting to log in a user." }
    )}

    // Construct Credentials Object
    const credentials = { username, password }

    // Database Promise Methods
    db('user')
    .where({ username: credentials.username })
    .first()
    .then( user => {
        // Verify That a User Exists With The Specified Password
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
            response.status(200).json({ authorized: `${username} has been logged in.` })
        } else {
            response.status(401).json({ rejected: "Unable to find a user with the provided password and username." })
        }
    })
    .catch(error => response.status(500).send(error));
})

/// ---- Server Port and Listen Method ----
const port = 9999;
server.listen(port, console.log(`Server Active on Port ${port}`))