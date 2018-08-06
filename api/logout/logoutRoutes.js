const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy();
    return res.status(200).json({ message: 'Logged out' });
})

module.exports = router;