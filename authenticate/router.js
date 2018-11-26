

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

//-- Route Handlers ------------------------------
async function handleRegistration(request, response, next) {
    next();
}
async function handleLogin       (request, response, next) {
    next();
}
async function handleGetAllUsers (request, response, next) {
    next();
}
