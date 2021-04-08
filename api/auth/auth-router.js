// !! Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// !! middleware functions from `auth-middleware.js`. You will need them here!
const User = require('../users/users-model');
const authRouter = require('express').Router();
const { checkUsernameFree } = require('./auth-middleware');
const { checkUsernameExists } = require('./auth-middleware');
const { checkPasswordLength } = require('./auth-middleware');
const bcrypt = require('bcryptjs');

/*
  * 1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  * response:
  * status 200
  * {
  *   "user_id": 2,
  *   "username": "sue"
  * }

  * response on username taken:
  * status 422
  * {
  *   "message": "Username taken"
  * }

  * response on password three chars or less:
  * status 422
  * {
  *   "message": "Password must be longer than 3 chars"
  * }
 */

// ?? POST ==> /api/auth/register ==> Return user object
authRouter.post(
	'/register',
	checkUsernameFree,
	checkPasswordLength,
	async (req, res, next) => {
		try {
			const newUser = req.body;

			const hash = bcrypt.hashSync(newUser.password, 12);
			newUser.password = hash;

			const saved = await User.add(newUser);
			res.status(200).json(saved);
		} catch (err) {
			next(err);
		}
	}
);

/*
  * 2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  * response:
  * status 200
  * {
  *   "message": "Welcome sue!"
  * }

  * response on invalid credentials:
  * status 401
  * {
  *   "message": "Invalid credentials"
  * }
 */

// ?? POST ==> /api/auth/login ==> Return "Welcome ${user}!"
authRouter.post('/login', checkUsernameExists, async (req, res) => {
	const user = req.body;
	req.session.user = user;
	res.status(200).json({ message: `Welcome ${user.username}!` });
});

/*
  * 3 [GET] /api/auth/logout

  * response for logged-in users:
  * status 200
  * {
  *   "message": "logged out"
  * }

  * response for not-logged-in users:
  * status 200
  * {
  *   "message": "no session"
  * }
 */

// ?? GET ==> /api/auth/logout ==> Return "logged out"
authRouter.get('/logout', async (req, res) => {
	if (req.session.user) {
		req.session.destroy((err) => {
			res.status(200).json({ message: 'logged out' }).end();
		});
	} else {
		res.status(200).json({ message: 'no session' });
	}
});

// !! Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = authRouter;
