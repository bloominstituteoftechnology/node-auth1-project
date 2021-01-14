function validateSession() {
    return function (req, res, next) {
        if (req.originalUrl !== '/api/auth/users') {
            next();
        }

        if (!req.session || !req.session.user) {
            return res.status(401).json({
                message: "Invalid session"
            });
        }
        next();
    }
}

module.exports = validateSession;