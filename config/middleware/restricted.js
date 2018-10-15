// for /api/users endpoint
function restricted(req, res, next) {
	if (req.session && req.session.username) {
		return next();
	}
	return res.status(401).json({ error: 'You shall not pass!' });
};

module.exports = restricted;
