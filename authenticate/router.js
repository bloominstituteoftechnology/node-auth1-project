

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
const credentials = require('./credentials_manager.js');


//== Router Configuration ======================================================

//-- Export Route Handler ------------------------
const router = module.exports = express.Router();

//-- Route Definitions ---------------------------
router.post(config.URL_AUTHENTICATION_REGISTER ,            handleRegistration);
router.post(config.URL_AUTHENTICATION_LOGIN    ,            handleLogin       );
router.post(config.URL_AUTHENTICATION_LOGOUT   ,            handleLogout      );
router.get (config.URL_AUTHENTICATION_USERSLIST, protected, handleGetAllUsers );

//-- Error Handling ------------------------------
router.use(errorHandler);


//== Utility Functions =========================================================

//-- Set Session ---------------------------------
function setSession(request, userId) {
    if(!request.session.user){
        request.session.user = {};
    }
    request.session.user.id = userId;
}

//-- End Point Protection Middleware -------------
function protected(request, response, next) {
    // Proceed to next() if user is logged in
    if(request.session && request.session.user) {
        next();
        return;
    }
    // Inform user of login error
    response.status(401).json({
        [config.RESPONSE_MESSAGE]: [config.MESSAGE_RESTRICTED]
    });
};

//-- Error Handling ------------------------------
function errorHandler(error, request, response, next) {
    response.status(500).json({
        [config.RESPONSE_ERROR]: error,
    });
    next(error);
}


//== Route Handlers ============================================================

//-- Register New User ---------------------------
async function handleRegistration(request, response, next) {
    try {
        // Attempt to register a new user
        const username = request.body.username;
        const password = request.body.password;
        const userId = await credentials.addCredential(username, password);
        // Inform of success
        setSession(request, userId);
        response.status(201).end();
        // Move to next middleware
        // next() <-- Not called when using end()
    } catch(error){ next(error);}
}

//-- User Log In ---------------------------------
async function handleLogin(request, response, next) {
    try{
        // Check if supplied username and password are valid
        const username = request.body.username;
        const password = request.body.password;
        const userId = await credentials.authenticate(username, password);
        // Handle failed authentication
        if(!userId){
            response.status(401).json({
                [config.RESPONSE_MESSAGE]: config.MESSAGE_AUTHENTICATION_FAILURE,
            });
        // Set Id on session and alert agent of success
        } else {
            setSession(request, userId);
            response.status(200).json({
                [config.RESPONSE_MESSAGE]: config.MESSAGE_AUTHENTICATION_SUCCESS,
            });
        }
        // Move to next middleware
        next();
    } catch(error){ next(error);}
}

//-- User Log Out --------------------------------
async function handleLogout(request, response, next) {
    // Handle users not logged in (no session)
    if(!request.session){
        response.status(200).end();
        return;
    }
    // Log out user
    request.session.destroy(error => {
        // Inform of error
        if(error) {
            throw error;
        }
        // Inform of success
        response.status(200).end();
    });
    // Move to next middleware
    // next() <-- Not called when using end()
}

//-- Display All Registered Users ----------------
async function handleGetAllUsers(request, response, next) {
    try {
        const users = await credentials.getUsers();
        response.status(200).json(users);
        // Move to next middleware
        next();
    } catch(error){ next(error);}
}
