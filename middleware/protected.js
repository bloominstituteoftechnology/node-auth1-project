module.exports = (request, response, next) => {
    if (request.path.search(/(\/api\/restricted)/g) >= 0) {
        console.log(request.path)
        if (request.session && request.session.username) {
            next();
        } else {
            response.status(401).json({ errorMessage: 'Not Authorized' })
        }
    } else {
        next();
}
}