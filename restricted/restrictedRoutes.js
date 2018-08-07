const express = require('express');
const router = express.Router();
const RESTRICTED_MESSAGE = 'Hey gurl hey!';
const RESTRICTION_ERROR = 'You shall not pass!';

const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  return res.status(401).json({'error': RESTRICTION_ERROR});
}

router.get('/', isLoggedIn, (req, res) => {
  return res.status(200).json(RESTRICTED_MESSAGE);
});

router.get('/*', isLoggedIn, (req, res) => {
  return res.status(200).json(RESTRICTED_MESSAGE);
});

router.post('/', isLoggedIn, (req, res) => {
  return res.status(200).json(RESTRICTED_MESSAGE);
});

router.post('/*', isLoggedIn, (req, res) => {
  return res.status(200).json(RESTRICTED_MESSAGE);
});

module.exports = router;