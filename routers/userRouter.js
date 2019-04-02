const router = require('express').Router();

const users = require('../helpers/usersModel');
const restricted = require('../helpers/restricted-middleware');

router.get('/', restricted, async (req, res) => {

  try {
    const userList = await users.find();

    res
      .status(200)
      .json(userList);
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error occurred while retrieving user list', error
      });
  };
});

module.exports = router;