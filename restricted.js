module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        // they're logged in, go ahead and provide access
        next();
    } else {
        // bounce them
        res.status(401).json({ message: "This area is restricted" });
    }
};