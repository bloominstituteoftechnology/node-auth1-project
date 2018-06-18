* [x] **Fork** and **Clone** this repository.



* [x] **CD into the folder** where you cloned the repository.



* [x] Take the steps necessary to create a `package.json` to keep a record of all dependencies.



* [x] Configure an _npm script_ named _"start"_ that will execute your code using _nodemon_ so that the server restarts on changes. Make _nodemon_ be a development time dependency only, it shouldn't be deployed to production.
Design and build a set of endpoints listed below.



* [ ] | POST   | /api/register | 
Creates a `user` using the information sent inside the `body` of the request.     



* [ ] Use `mongoose middleware` to implement password hashing.



* [ ] | POST   | /api/login    | 
Use the credentials sent inside the `body` to login the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, repond with the correct status code and the message: 'You shall not pass!' |




* [ ] Use `local express middleware` and `mongoose model methods` to implement password verification.




* [ ] | GET    | /api/users    | 




If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.            |



* [ ] **Use _Postman_ to test the API as you work through the exercises.**



###Stretch Problems



* [ ] Write a piece of **global** middleware that ensures a user is logged in when accessing _any_ route prefixed by `/api/restricted/`. For instance, `/api/restricted/something`, `/api/restricted/other`, and `/api/restricted/a` should all be protected by the middleware; only logged in users should be able to access these routes.



* [ ] Build a React application that implements components to register, login and view a list of users.
