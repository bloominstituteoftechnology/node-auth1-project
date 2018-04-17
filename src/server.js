const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");

const User = require("./user.js");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();

const isInSession = function(req, res, next) {
    if (req.session.name) {
        req.user = req.session.name;
    } else {
        return sendUserError("User must be login", res);
    }
    next();
};
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
    session({
        secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
        name: "Auth",
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
        secure: false,
    }),
);
server.use("/restricted", function(req, res, next) {
    if (req.session.name) {
        req.user = req.session.name;
    } else {
        return sendUserError("Must be login to have access.", res);
    }
    next();
});

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
    res.status(STATUS_USER_ERROR);
    if (err && err.message) {
        res.json({ message: err.message, stack: err.stack });
    } else {
        res.json({ error: err });
    }
};

//POST
server.post("/users", (req, res) => {
    const { username, password } = req.body;
    const userInfo = { username, passwordHash: password };

    if (!username || !password) {
        return sendUserError("Must provide username and password", res);
    }

    const newUser = new User(userInfo);

    newUser.save((err, savedUser) => {
        if (err) {
            sendUserError(
                err /*Username name is already in use. Please provide another username*/,
                res,
            );
            return;
        }
        res.status(200).json(savedUser);
    });
});

server.post("/log-in", (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(user => {
            if (user) {
                user.isPasswordValid(password).then(isValid => {
                    if (isValid) {
                        req.session.name = user.username;
                        res.json({
                            success: true,
                        });
                    } else {
                        res.status(401).json({
                            message: "Password invalid, please try again.",
                        });
                    }
                });
            } else {
                return sendUserError("Please provide valid username.", res);
            }
        })
        .catch(err => res.status(500).json(err));
});
// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", isInSession, (req, res) => {
    // Do NOT modify this route handler in any way.
    res.json(req.user);
});

server.get("/restricted", (req, res) => {
    res.json(req.user);
});

module.exports = { server };
