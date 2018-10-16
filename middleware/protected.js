module.exports = (request, response, next) => {
    if (request.session && request.session.username) {
        next();
    } else {
        response.status(401).json({ errorMessage: 'Not Authorized'})
    }
}