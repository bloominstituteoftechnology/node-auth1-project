

/*== Authentication Route Handler ==============================================

POST /api/register
    Creates a user using the information sent inside the body of the request.
    Hash the password before saving the user to the database.
POST /api/login
    Use the credentials sent inside the body to authenticate the user. On
    successful login, create a new session for the user and send back a 'Logged
    in' message and a cookie that contains the user id. If login fails, respond
    with the correct status code and the message: 'You shall not pass!'
GET  /api/users
    If the user is logged in, respond with an array of all the users contained
    in the database. If the user is not logged in repond with the correct status
    code and the message: 'You shall not pass!'.

*/

//-- Dependencies --------------------------------
const express = require('express');
const config = require('../config.js');
const database = require('../database.js');

//-- Route Handler -------------------------------
const router = module.exports = express.Router();
router.post(config.URL_AUTHENTICATION_REGISTER , handleRegistration);
router.post(config.URL_AUTHENTICATION_LOGIN    , handleLogin       );
router.get (config.URL_AUTHENTICATION_USERSLIST, handleGetAllUsers );


//== Route Handlers ============================================================

//-- Register New User ---------------------------
async function handleRegistration(request, response, next) {
    try {
        // Attempt to register a new user
        let username = request.body.username;
        let password = request.body.password;
        await database.addCredential(username, password);
        // Inform of success
        response.status(201).end();
    }
    catch(error) {
        response.status(500).json({
            [config.RESPONSE_ERROR]: error,
        });
    }
    finally {
        next();
    }
}

//-- User Login ----------------------------------
async function handleLogin(request, response, next) {
    try {
        // Check if supplied username and password are valid
        let username = request.body.username;
        let password = request.body.password;
        let authenticated = await database.authenticate(username, password);
        // Authentication failed
        if(!authenticated){
            response.status(401).json({
                [config.RESPONSE_MESSAGE]: config.MESSAGE_AUTHENTICATION_FAILURE,
            });
        // Authentication was a success
        } else{
            // To Do: Complete tomorrow after lesson on sessions and cookies.
            response.status(200).json({
                [config.RESPONSE_MESSAGE]: config.MESSAGE_AUTHENTICATION_SUCCESS,
            })
        }
    }
    catch(error) {
        response.status(500).json({
            [config.RESPONSE_ERROR]: error,
        });
    }
    finally {
        next();
    }
}

//-- Display All Registered Users ----------------
async function handleGetAllUsers(request, response, next) {
    // To Do: Check if user is logged in.
    // To be completed tomorrow after our lesson on sessions and cookies.
    let users = await database.getUsers();
    response.status(200).json(users);
    next();
}
