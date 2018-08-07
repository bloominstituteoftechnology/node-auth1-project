const express = require('express');
const router = express.Router();

// logout
router.get('/', async (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({error: 'Error Logging Out'});
            } else {
                res.status(200).json({message: 'Goodbye'});
            }
        });
    }
});

module.exports = router;
