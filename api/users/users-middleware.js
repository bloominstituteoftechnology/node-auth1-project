function validateHeaders(req, res, next) {
    if (!req.headers) return res.status(400).json({message: 'Missing header credentials'})

    const username = req.get('username')

    if (!username || typeof username != 'string') return res.status(400).json({message: 'Missing header: username'})

    const password = req.get('password')

    if (!password || typeof password != 'string') return res.status(400).json({message: 'Missing header: password'})

    res.locals.user = {username, password}
    next()
}

function validateSession(req, res, next) {
    if (req.session && req.session.userId) next()
    else res.status(401).json({message: 'Missing valid session'})
}

module.exports = {validateHeaders, validateSession}