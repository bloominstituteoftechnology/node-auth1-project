function postCheck(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ errorMessage: "Please provide a username and password!" });
    req.username = username;
    req.password = password;
    next();
}

function loginCheck(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ errorMessage: "You shall not pass!" });
    next();
}

module.exports.postCheck = postCheck;
module.exports.loginCheck = loginCheck;