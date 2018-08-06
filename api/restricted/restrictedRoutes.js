const express = require('express');

const router = express.Router();

router.get('/something', (req, res) => {
    res.send('Restricted');
})

router.get('/other', (req, res) => {
    res.send('Restricted');
})

router.get('/a', (req, res) => {
    res.send('Restricted');
})

module.exports = router;