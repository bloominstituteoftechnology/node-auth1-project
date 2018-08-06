function postCheck(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ errorMessage: "Please provide a username and password!" });
    req.username = username;
    req.password = password;
    next();
}

module.exports.postCheck = postCheck;