function restrict() {
    return async (req, res, next) => {
        try {
            if (!req.session || !req.session.user) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

module.exports = {
    restrict
}