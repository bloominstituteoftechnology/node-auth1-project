const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251

mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // DONE TODO: fill in this schema
  username: {
  	type: String,
  	required: true,
  	unique: true,
  }
  password: {
  	type: String,
  	required: true,
  }
  //passwordHash: {
  //	type: String,
	//required: true,
  //}

});

module.exports = mongoose.model('User', UserSchema);


POST /users`

The `POST /users` route expects two parameters: `username` and `password`. When
the client makes a `POST` request to `/users`, hash the given password and
create a new user in MongoDB. Send the user object as a JSON response.

Make sure to do proper validation and error checking. If there's any error,
respond with an appropriate status and error message using the `sendUserError()`
helper function.