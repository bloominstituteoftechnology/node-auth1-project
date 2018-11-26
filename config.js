

//== Project Constants =========================================================

const PORT = 3000;
module.exports = {
    // Server Port and Listening
    PORT: PORT,
    MESSAGE_SERVER_LISTENING: `Server Listening on port ${PORT}`,
    // Database
    TABLE_CREDENTIALS: 'credentials',
    FIELD_ID: 'id',
    FIELD_USERNAME: 'username',
    FIELD_PASSWORD: 'password',
    LIMIT_USERNAME: 128,
    LIMIT_PASSWORD: 128,
    // Route URLs
    URL_AUTHENTICATION          : '/api'     ,
    URL_AUTHENTICATION_REGISTER : '/register',
    URL_AUTHENTICATION_LOGIN    : '/login'   ,
    URL_AUTHENTICATION_USERSLIST: '/users'   ,
};
