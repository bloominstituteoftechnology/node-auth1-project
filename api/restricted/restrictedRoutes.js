const express = require('express');
const { loginCheck } = require('../../middleware/required');

const router = express.Router();

router.use(loginCheck);

router.get('/', (req, res) => {
    res.send('Restricted');
})

router.get('/something', (req, res) => {
    res.send('Something');
})

router.get('/other', (req, res) => {
    res.send('Other');
})

router.get('/a', (req, res) => {
    res.send('A');
})

module.exports = router;