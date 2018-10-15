const errorHandler = (err, req, res, next) => {
    // err = [errorId, supplied message for errorOutput]
    const errors = {
        h400: {
            "httpStatus": 400,
            "title": "Missing object properties",
            "description": "All object properties must be provided",
            "recoveryInstructions": "Please ensure all required object properties are in your request and try again.",
            "errorOutput": err[1]
        },
        h401: {
            "httpStatus": 401,
            "title": "Unauthorized",
            "description": "The credentials provided were invalid",
            "recoveryInstructions": "Please ensure you have entered valid credentials and try again.",
            "errorOutput": err[1]
        },
        h403: {
            "httpStatus": 403,
            "title": "Forbidden",
            "description": "The request was valid, but the server is refusing action",
            "recoveryInstructions": "The user might not have the necessary permissions for a resource, or may need an account of some sort.",
            "errorOutput": err[1]
        },
        h404: {
            "httpStatus": 404,
            "title": "Object not found",
            "description": "The server was unable to find the specified object",
            "recoveryInstructions": "Please ensure you specify an existing object and try again.",
            "errorOutput": err[1]
        },
        h500: {
            "httpStatus": 500,
            "title": "Database error",
            "description": "The server is having trouble communicating with the database",
            "recoveryInstructions": "Please provide the server administrator the provided errorOutput and/or try again later.",
            "errorOutput": err[1]
        }
    };
    
    if(!errors.hasOwnProperty(err[0])) throw `Uncaught Exception! Please review:\n${err}`;

    if(err[0] === 'h500') console.error('Error:\n', err[1]);

    const error = errors[err[0]];
    res.status(error.httpStatus).json(error);
}

module.exports = errorHandler;
