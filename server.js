const codes = require('./data/statusCodes');

const express = require('express');
const session = require('express-session');
const server = express();


const userRoutes = require('./api/userRouter');
const registerRoutes = require('./api/registerRouter');
const loginRoutes = require('./api/loginRouter');


server.use(express.json());
server.use(session({
    //default is connect.sid, need to change the name so the attacker won't know the library we used
    name: 'tanglewood',
    //the secret is a private key in order to decrypt our cookie
    secret: 'gahniNoh2Eeve8jiweerie9aequu5Tha8jahm8lie3iecha7La',

    cookie: {
        //one day in milliseconds
        maxAge: 1 * 24 * 60 * 60 * 1000,
        //only set cookies over https. Server will not send back a cookie over http
        secure: false,
    }, 
    //don't let JS code access cookies. Browser extensions run JS code on your browser
    httpOnly: true,
    //forces the session to be saved back to the session store, even if the session was never modified during the request
    resave: false,
    //forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified
    saveUninitialized: true,
}));
server.use('/api/users', userRoutes);
server.use('/api/register', registerRoutes);
server.use('/api/login', loginRoutes);



server.use((err, req, res, next) => {
    err.code = err.code !== undefined ? err.code : codes.INTERNAL_SERVER_ERROR;
    const errorInfo = {
        status: err.code,
        errorMessage: err.message,
        success: false,
        route: err.route
    }
    switch (errorInfo.code) {
        case codes.BAD_REQUEST: 
            res.status(codes.BAD_REQUEST).json(errorInfo);
            return;
        case codes.NOT_FOUND: 
            res.status(codes.NOT_FOUND).json(errorInfo);
            return;
        default:
        res.status(codes.INTERNAL_SERVER_ERROR).json(errorInfo);
    }
});
const port = 8001;
server.listen(port, (req, res) => console.log(`Port ${port} is in use`));
