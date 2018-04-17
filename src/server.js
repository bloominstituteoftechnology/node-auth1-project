const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };






/*const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

mongoose
.connect('mongodb://localhost/authdb')
.then(() => {
	console.log('\n=== connected to MongoDB ===\n');
	})
.catch(err => console.log('database connection failed', err));

const server = express();

// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. 
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};


//My stuff that I Added
server.post('/ login', (req, res) => {
	const { username, password } =req.body
	const userInfo ={username, passwordHashed}
	User.findOne({ username, password } req.body;

	then(user => {
		user.passwordHashed(password, cb);
	}
	})
	.catch(err => res.status(500).json(err));
});

// TODO: implement routes

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});


server.get(/, (req,res) => {
	res.status(200).json({ api: 'running' });
});
const port = process,env.PORT || 3000;
server.listen(port, () => console.log('\n=== api on port: ${port} ===\n'));




module.exports = { server };
*/
