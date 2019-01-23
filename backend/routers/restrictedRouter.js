const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/', (req, res) => {
    res.json({info: "Restricted Main"});
});

router.get('/foo', (req, res) => {
    res.json({info: "Restricted Foo"});
});

router.get('/bar', (req, res) => {
    res.json({info: "Restricted Bar"});
});

module.exports = router;