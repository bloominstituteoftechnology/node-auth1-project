const helpers = require('../data/helpers');
const express = require('express');
const router = express.Router();

router.post('/register', (req, res, next) => {
  helpers
    .register(req.body)
    .then(response => res.status(201).json(response))
    .catch(next);
});

router.post('/login', (req, res, next) => {
  let body = req.body;
  helpers
    .login(body)
    .then(response => {
      if (response) {
        req.session.name = body.username;
        res.status(200).json(`Welcome ${req.session.name}`);
      } else next({ code: 400 });
    })
    .catch(next);
});

module.exports = router;
