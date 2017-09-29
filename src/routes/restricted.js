const express = require('express');

const router = express.Router();

const secretResponder = (req, res) => {
  res.json({ success: 'You made it to the super secret restricted route' });
};

router.get('/something', secretResponder);
router.get('/other', secretResponder);
router.get('/a', secretResponder);

module.exports = router;
