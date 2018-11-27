

/*== Restricted Route Handler ==================================================

Write a piece of global middleware that ensures a user is logged in when
accessing any route prefixed by /api/restricted/. For instance,
/api/restricted/something, /api/restricted/other, and /api/restricted/a should
all be protected by the middleware; only logged in users should be able to
access these routes.

*/

//-- Dependencies --------------------------------
const express = require('express');
const config = require('./config.js');

//-- Export Route Handler ------------------------
const router = module.exports = express.Router();

//-- Route Definitions ---------------------------
router.use(async function (request, response, next) {
    // Proceed to next() if user is logged in
    if(request.session && request.session.user) {
        next();
        return;
    }
    // Inform user of login error
    response.status(401).json({
        [config.RESPONSE_MESSAGE]: [config.MESSAGE_RESTRICTED]
    });
});
