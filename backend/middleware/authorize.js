// Local imports
const authConst = require('../data/helpers/authConst');
const db = require('../data/helpers/authDb');

// Middleware added to routes that checks for authorization.
// Changes req.isAuthorized to whether it is authorized or not.
const authorize = permission => (req, res, next) => {

};

// Module export
module.exports = authorize;