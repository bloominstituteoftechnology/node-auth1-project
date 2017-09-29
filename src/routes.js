const express = require('express');
const controller = require('./controllers');
const { catchErrors, loggedIn } = require('./handlers');

const router = express.Router();

router
  .route('/users')
  .post(catchErrors(controller.newUser));

router
  .route('/log-in')
  .post(catchErrors(controller.login));

router
  .route('/me')
  .get(loggedIn, controller.getMe);

router
  .route('/restricted/*')
  .all(loggedIn, controller.restricted);

module.exports = router;
