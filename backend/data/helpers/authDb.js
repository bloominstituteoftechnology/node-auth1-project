// Local imports
const authConst = require('./authConst');

// Attempts to create a new user entry in the database.
const register = (email, username, password) => {

};

// Attempts to create a new session.
// If a session is valid and exists, return that session key.
// Otherwise, create a new session key.
const login = (email, password) => {

};

// Checks if a specified session key exists, is not expired, and meets the permission requirement.
const isAuthorized = (sessionKey, requirement) => {

};

// Module exports
module.exports = {
    register,
    login,
    isAuthorized
};
