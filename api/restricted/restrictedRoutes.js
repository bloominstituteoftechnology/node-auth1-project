// projectsRoutes.js
const express = require('express')

const db = require('../../data/dbConfig.')
const { protected } = require('../middleware.js')

const router = express.Router();

const echo = (req, res) => {
  res.status(200).json({
    message: 'hey this endpoint work!',
    params: req.params,
    query: (req.query ? req.query : ''),
    body: req.body
  });
}

const restrictedMW = [protected, echo]
router.use('/*', restrictedMW);
router.post('/', restrictedMW);
router.get('/:id', restrictedMW);
router.get('/something', restrictedMW);
router.get('/other', restrictedMW);

module.exports = router;