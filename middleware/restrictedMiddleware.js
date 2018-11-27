// only allows access to all routes starting /api/restricted/ if user is logged in
module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized to view content' });
    }
}