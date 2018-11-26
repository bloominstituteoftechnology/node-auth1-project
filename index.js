

//== Authentication Test Server ================================================

//-- Dependencies --------------------------------
const express = require('express');
const config = require('./config.js');
const routeAuthenticate = require('./authenticate/router.js');

//-- Open New Server -----------------------------
const application = express();
application.listen(config.PORT, () => {
    console.log(config.MESSAGE_SERVER_LISTENING);
});

//-- Server Middleware ---------------------------
application.use(express.json());

//-- Request Routing -----------------------------
application.use(config.URL_AUTHENTICATION, routeAuthenticate);
