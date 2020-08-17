module.exports = (req, res, next) => {
    // check that the client is authenticated
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ you: "shall not pass!" });
    }
};
