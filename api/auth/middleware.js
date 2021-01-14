function validateSession() {
    return function (req, res, next) {
        console.log(req.path);
        if (req.path === '/api/auth/login' || req.path === '/api/auth/login') {
            return next();
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