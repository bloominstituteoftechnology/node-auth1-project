[x] 1.) Create server. Add yarn modules: `mongoose` and `express`
[x] 2.) Connect to MongoDB (use db 'AuthDemo')
[x] 3.) Create a User Schema and Model, this Schem will take a username(unique) and a password.
[x] 4.) Create a route, '/register' that takes a post method. The body will have a username and password field.
[x] 5.) Using Postman create one new user (with plain text password)
[x] 6.) Add the yarn module `bcrypt`
[x] 7.) On the UserSchema, add a `.pre('save'` middleware.
[x] 8.) The mongoose pre middleware will take the existing password and hash it.
[ ] 9.) Store the new hashed password on the User document.

** ENDPOINTS **
[ ] | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request.  **Hash the password** before saving the user to the database.

[ ] | POST   | /api/login    | Use the credentials sent inside the `body` to login the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, repond with the correct status code and the message: 'You shall not pass!'

[ ] | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.

[ ] Protected Routes - Write a piece of **global** middleware that ensures a user is logged in when accessing _any_ route prefixed by `/api/restricted/`. For instance, `/api/restricted/something`, `/api/restricted/other`, and `/api/restricted/a` should all be protected by the middleware; only logged in users should be able to access these routes.

[ ] - Build a React application that implements components to register, login and view a list of users.
