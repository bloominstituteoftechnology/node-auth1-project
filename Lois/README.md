# Auth Lab
Topics:
  * Express Middleware
  * Sessions
  * Passwords
  * Authentication

## Description
In the lecture, we presented three seemingly disparate concepts: middleware,
sessions, and passwords. For this lab, your job will be to combine these
concepts into one authentication system.

## Running the Project
- Run `npm install` to download the dependencies.
- Keep `mongod --dbpath data` running in its own terminal.
- Run `npm test` to run the tests. If you'd like, you can run `npm run watch`
  to automatically re-reun the tests when you make modifications.
- To test your application in your browser, or by using
  [Postman](https://www.getpostman.com/), make sure you've installed `nodemon`
  via `npm install -g nodemon` and then run `nodemon src/app.js`. `nodemon` will
  keep the server running and automatically restart it if you change anything.
  You can now make requests to `http://localhost:3000` in your browser or
  Postman!
- Make modifications to `src/user.js` and `src/server.js` to make the tests pass.
- If you'd like, feel free to reference the tests in `tests/server.test.js` as
  you're developing.
- Once all tests have passed, you're done! Send us a pull request.

## Instructions
### `src/user.js`
First, write the schema for the user model in `src/user.js`. Each user has two
properties: `username`, a String, and `passwordHash`, also a String. Both
properties are required, and the username should be unique (use the option
`unique: true`).  This prevents two users from having the same username.

### `src/server.js`
Now start editing `src/server.js`. Note that we've provided you a helper
function `sendUserError()` that can send down either an object error or a string
error. You'll use this liberally in your routes.

We've also gone ahead and initialized the express-session middleware so you can
use the client-specific, persistent `req.session` object in your route handlers.

### `POST /users`
The `POST /users` route expects two parameters: `username` and `password`. When
the client makes a `POST` request to `/users`, hash the given password and
create a new user in MongoDB. Send the user object as a JSON response.

Make sure to do proper validation and error checking. If there's any error,
respond with an appropriate status and error message using the `sendUserError()`
helper function.

### `POST /log-in`
The `POST /log-in` route expects two parameters: `username` and `password`. When
the client makes a `POST` request to `/log-in`, check the given credentials and
log in the appropriate user. Send the object `{ success: true }` as a JSON
response if everything works out.

You'll need to use a session to track who is logged in. Do **NOT** store the
entire user object in the session; if the user in MongoDB gets updated or
deleted, the session will not reflect the changes. Instead, store some
information that will let you uniquely identify which user is logged in.

Make sure to do proper validation and error checking. If there's any error, or
if the credentials are invalid, respond with an appropriate status and error
message using the `sendUserError()` helper function.

### `GET /me`
The `GET /me` route **should only be accessible by logged in users**. We've
already implemented the route handler for you; your job is to add local
middleware to ensure that only logged in users have access.

Make sure to do proper validation and error checking. If there's any error, or
if no user is logged in, respond with an appropriate status and error message
using the `sendUserError()` helper function.

## Extra Credit
If you'd like to go a step further, write a piece of **global** middleware that
ensures a user is logged in when accessing *any* route prefixed by
`/restricted/`. For instance, `/restricted/something`, `/restricted/other`, and
`/restricted/a` should all be protected by the middleware; only logged in users
should be able to access these routes.
