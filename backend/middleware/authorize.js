// Local imports
const authConst = require('../data/helpers/authConst');
const db = require('../data/helpers/authDb');

// Middleware added to routes that checks for authorization.
// If the user is authorized, continues to the request.
// Otherwise, return 403.
const authorize = permission => (req, res, next) => {

};

// Module export
module.exports = authorize;