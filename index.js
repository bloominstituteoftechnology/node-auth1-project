

//== Authentication Test Server ================================================

//-- Dependencies --------------------------------
const express = require('express');
const config = require('./config.js');
const routeRestricted   = require('./restricted_router.js'  );
const routeAuthenticate = require('./authenticate/router.js');
const sessionManager    = require('./session_manager.js'    );

//-- Open New Server -----------------------------
const application = express();
application.listen(config.PORT, () => {
    console.log(config.SERVER_LISTENING);
});

//-- Server Middleware ---------------------------
application.use(express.json());
application.use(sessionManager);

//-- Request Routing -----------------------------
application.use(config.URL_RESTRICTED    , routeRestricted  );
application.use(config.URL_AUTHENTICATION, routeAuthenticate);
