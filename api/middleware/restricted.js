function restricted (req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = restricted;