# Authentication Project

## Topics

* Authentication
* Express Middleware
* Mongoose Middleware and Methods
* Sessions and Cookies

## Assignment

Use Node.js, Express and Mongoose to build an API that provides **Register** and **Login** functionality using MongoDB to store _User_ information using **sessions** and **cookies** to keep a record of logged in users.

## Instructions

You will build the solution from scratch, no starter code is provided. Feel free to structure your API anyway you want, but aim at making it easy to maintain in the future.

### Download Project Files and Install Dependencies

* **Fork** and **Clone** this repository.
* **CD into the folder** where you cloned the repository.
* Do your magic!

### Implement Requirements

* Take the steps necessary to create a `package.json` to keep a record of all dependencies.
* Configure an _npm script_ named _"start"_ that will execute your code using _nodemon_ so that the server restarts on changes. Make _nodemon_ be a development time dependency only, it shouldn't be deployed to production.
* Design and build a set of endpoints listed below.
* Use `mongoose middleware` to implement password hashing.
* Use `local express middleware` and `mongoose methods` to implement password verification.
* **Use _Postman_ to test the API as you work through the exercises.**

#### Endpoints

| Method | Endpoint      | Description                                                                                                                                                                                                                                                                                 |
| ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.                                                                                                                                                 |
| POST   | /api/login    | Use the credentials sent inside the `body` to login the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, repond with the correct status code and the message: 'You shall not pass!' |
| GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.            |

## Stretch Problem

* Write a piece of **global** middleware that ensures a user is logged in when accessing _any_ route prefixed by `/api/restricted/`. For instance, `/api/restricted/something`, `/api/restricted/other`, and `/api/restricted/a` should all be protected by the middleware; only logged in users should be able to access these routes.
* Build a React application that implements components to register, login and view a list of users.
