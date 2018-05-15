const restrictAccess = (req, res, next) => {
    if(req.path.startsWith('/api/restricted')) {
        if(req.session && req.session.userId) {
            next();
        } else {
            res.status(422).json({ message: 'You must be logged in to view that!' });
        }
    } else {
        next();
    }
}

module.exports = {
    restrictAccess
}