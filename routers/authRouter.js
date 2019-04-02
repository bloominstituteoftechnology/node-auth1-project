const router = require('express').Router();
const bcrypt = require('bcryptjs');

const users = require('../helpers/usersModel.js');

router.post('/register', async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 16);
  user.password = hash;

  try {
    const newUser = await users.add(user);
    res
      .status(201)
      .json({ message: `New user added: `, newUser });

  } catch (error) {
    res
      .status(500)
      .json({ message: `Error occurred while adding new user: `, error });
  };
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  users.findby({ username })
    .first()
    .then(user => {
      if (username && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
      }
    })
})

module.exports = router;