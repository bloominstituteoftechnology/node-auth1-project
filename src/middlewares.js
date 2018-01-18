const bcrypt = require('bcrypt');
const User = require('./user.js');

const BCRYPT_COST = 11;
// ####################### Middleware ############################
// Encrypt Passwords
const hashPw = (req, res, next) => {
    const { password } = req.body;
    if (!password || password.length === 0) {
        sendUserError('Please Provide a Password', res);
    } else {
        bcrypt.hash(password, BCRYPT_COST, (err, hashedPw) => {
            if (err) {
                sendUserError(err, res);
            } else {
                req.body.hashedPw = hashedPw;
            }
            next();
        });
    }
};

// Authenticate users.
const compareHashPw = (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username }, (err, foundUser) => {
        if (err || !foundUser) {
            sendUserError('did not find any users with the specifications', res);
        } else {
            const hashedPw = foundUser.passwordHash;
            bcrypt.compare(password, hashedPw, (error, result) => {
                if (error || !result) {
                    sendUserError('User could not be authenticated', res);
                } else {
                    req.body.authenticatedUser = foundUser.username;
                    next();
                }
            });
        }
    });
};

const verifyLogin = (req, res, next) => {
    const { username } = req.session;
    if (!username) {
        sendUserError('User Not Authenticated', res);
        next();
    } else {
        User.findOne({ username }, (err, foundUser) => {
            if (err || !foundUser) sendUserError(err, res);
            req.user = foundUser;
            next();
        });
    }
};


module.exports = {
    hashPw,
    compareHashPw,
    verifyLogin,
};