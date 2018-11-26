

//== Project Constants =========================================================

const PORT = 3000;
module.exports = {
    // Environment
    DATABASE_ENVIRONMENT: 'development',
    // Server Port and Listening
    PORT: PORT,
    SERVER_LISTENING: `Server Listening on port ${PORT}`,
    // Route URLs
    URL_AUTHENTICATION          : '/api'     ,
    URL_AUTHENTICATION_REGISTER : '/register',
    URL_AUTHENTICATION_LOGIN    : '/login'   ,
    URL_AUTHENTICATION_USERSLIST: '/users'   ,
    // User messages and json fields
    RESPONSE_ERROR  : 'error'  ,
    RESPONSE_MESSAGE: 'message',
    MESSAGE_AUTHENTICATION_SUCCESS: 'Login Successful',
    MESSAGE_AUTHENTICATION_FAILURE: 'The username and password you supplied were incorrect',
    // Database
    PASSWORD_HASH_DEPTH: 4,
    TABLE_CREDENTIALS: 'credentials',
    FIELD_ID      : 'id'      ,
    FIELD_USERNAME: 'username',
    FIELD_PASSWORD: 'password',
    LIMIT_USERNAME: 128,
    LIMIT_PASSWORD: 128,
    // Errors
    ERROR_DATABASE_INTERNAL       : 'Internal Error',
    ERROR_AUTHENTICATION_NAMETAKEN: 'Registration failed: Username not available',
};
