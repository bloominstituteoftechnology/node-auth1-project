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

  users.findBy({ username })
    .first()
    .then(user => {
      if (username && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;

        res
          .status(200)
          .json({
            message: `Welcome, ${user.username}!`
          });
      } else {
        res
          .status(401)
          .json({
            messsage: 'Invalid credentials!'
          });
      };
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res
          .status(500)
          .json({
            message: 'invalid session'
          });
      } else {
        res
          .status(200)
          .json({
            message: 'Logout successful!'
          });
      };
    });
  } else {
    res
      .status(200)
      .json({
        message: 'Logout successful!'
      });
  };
});

module.exports = router;