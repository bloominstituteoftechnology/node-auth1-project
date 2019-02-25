// Local imports
const db = require('../data/helpers/authDb');

// Middleware added to routes that checks for authorization.
// Calls next(req, res) if the user is authenticated, otherwise returns 403.
// Checks req.body.sessionKey
const authorize = (requirement, next) => (req, res) => {
    if (!req.body || !req.body.sessionKey) {
        res.status(403).json({ error: 'You shall not pass!' });
        return;
    }

    db.isAuthorized(sessionKey, requirement)
        .then(_ => {
            next(req, res);
        })
        .catch(_ => {
            res.status(403).json({ error: 'You shall not pass!' });
        });
};

// Module export
module.exports = authorize;