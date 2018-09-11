function isLoggedIn(req, res, next) {
	if (req.session && req.session.name) {
		next();
	} else {
		res.status(403).json({ message: "Invalid User Name or Password" });
	}
}

module.exports = { isLoggedIn };
