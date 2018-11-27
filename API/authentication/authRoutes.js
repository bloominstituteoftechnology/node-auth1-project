/*== AUTHENTICATION API ==============================================

POST -> /api/register
	Creates a user using the information sent inside the body of the
	request. hash the password before saving the user to the database.

POST -> /api/login
	Use the credentials sent inside the body to authenticate the user.
	On successful login, create a new session for the user and send back
	a 'Logged in' message and a cookie that contains the user id. If login
	fails, respond with correct status code and the message: 'You shall
	pass!'

GET -> /api/users
	If the user is logged in, respond with an array of all the users
	contained in the databse. If the user is not logged in respond with
	the correct status code and the message: 'You shall not pass!'

GET -> /api/logout
  If the user logs out, destroy the session.
*/

// EXPRESS ROUTER, DEPENDENCIES
// ==============================================
const router = require('express').Router();
const bcrypt = require('bcryptjs');

const authMi = require('./authMiddleware');
const config = require('./authConfig');
const authDb = require('./authHelper');

// AUTH ROUTES
// ==============================================
router.post(config.REGISTER, authRegister);
router.post(config.LOGIN, login);
router.get(config.USERS, authMi.protected, users);
router.get(config.LOGOUT, logout);

// AUTH ROUTES CALLBACK FUNCTIONS
// ==============================================
async function authRegister(req, res) {
  try {
    const raw = req.body;
    const username = await authDb.checkCredentials(raw.username);
    if (username) {
      res.status(404).json(config.USERNAME_UNAVAILABLE);
    } else {
      const hash = bcrypt.hashSync(raw.password, 4);
      raw.password = hash;
      await authDb.registerUser(raw);
      res.status(201).json(config.REGISTER_SUCCESS);
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

async function login(req, res) {
  try {
    const raw = req.body;
    const user = await authDb.checkCredentials(raw.username);
    if (user && bcrypt.compareSync(raw.password, user.password)) {
      req.session.user = user.id;
      res.status(200).json(config.AUTH_SUCCESS);
    } else {
      res.status(401).json(config.AUTH_FAIL);
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

async function users(_, res) {
  try {
    const users = await authDb.get();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
}

function logout(req, res) {
  if (req.session) {
    req.session.destroy(err => {
      err ? res.send('You can never leave!') : res.send('Bye!');
    });
  } else res.end();
}

module.exports = router;
