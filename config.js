

//== Project Constants =========================================================

//-- Internal Constants --------------------------
// Time
const SECOND =      1000;
const MINUTE = SECOND*60;
const HOUR   = MINUTE*60;
const DAY    = HOUR  *24;
// (should get from cmd line)
const PORT = 3000;

//-- Exported Constants --------------------------
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
    URL_AUTHENTICATION_LOGOUT   : '/logout'  ,
    URL_AUTHENTICATION_USERSLIST: '/users'   ,
    // Database
    PASSWORD_HASH_DEPTH: 4,
    TABLE_CREDENTIALS: 'credentials',
    FIELD_ID      : 'id'      ,
    FIELD_USERNAME: 'username',
    FIELD_PASSWORD: 'password',
    LIMIT_USERNAME: 128,
    LIMIT_PASSWORD: 128,
    // User Feedback (including Error Messages)
    RESPONSE_ERROR  : 'error'  ,
    RESPONSE_MESSAGE: 'message',
    MESSAGE_AUTHENTICATION_SUCCESS: 'Login Successful',
    MESSAGE_AUTHENTICATION_FAILURE: 'You shall not pass!',
    ERROR_DATABASE_INTERNAL       : 'Internal Error',
    ERROR_AUTHENTICATION_NAMETAKEN: 'Registration failed: Username not available',
    // Session Store
    SESSION_MAXAGE: DAY,
    TABLE_SESSIONS: 'sessions',
    FIELD_SESSIONID: 'sid',
};
