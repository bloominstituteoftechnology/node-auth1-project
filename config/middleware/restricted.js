//global middleware
function restricted(req, res, next) {
	if (req.originalUrl.includes('/api/restricted')) {
		if (req.session && req.session.username) {
			return next();
		}
		return res.status(401).json({ error: 'You shall not pass!' });
	}
	return next();
};

module.exports = restricted;
