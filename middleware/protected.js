// Middleware to Prevent Access to Restricted Endpoints
module.exports = (request, response, next) => {

    // Check if path starts with restriced url path. 
    if (request.path.search(/(\/api\/restricted)/g) = 0) {
        // Execute Next Middleware if there is a current, authorized, session.
        if (request.session && request.session.username) {
            next();
        } else {
            response.status(401).json({ errorMessage: 'Not Authorized' })
        }
    } else {
        next();
}
}