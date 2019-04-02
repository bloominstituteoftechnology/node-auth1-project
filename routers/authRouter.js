const router = require('express').Router();
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 16);
  user.password = hash;


})

module.exports = router;