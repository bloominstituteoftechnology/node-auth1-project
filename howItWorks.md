# Introduction to Authentication and Using Sessions and Cookies

## Day 1 Objectives

_**Part one, due Monday:**_ Use `Node.js`, `Express` and `Knex` to build an API that provides `Register` and `Login` functionality using `SQLite` to store `User` information. Make sure the password is not stored as plain text.

## 1. Inititialize yarn to create package.json

```
$ yarn init
```

## 2. Update the package.json by adding dependencies and a start script

```
$ yarn add bcryptjs express knex nodemon sqlite3

  "scripts": {
    "start": "nodemon server.js"
  },
```

```
{
  "name": "auth-i",
  "version": "1.0.0",
  "main": "server.js",
  "repository": "https://github.com/blkfltchr/auth-i.git",
  "license": "MIT",
  "scripts": {
    "start": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "express": "^4.16.3",
    "knex": "^0.15.2",
    "nodemon": "^1.18.3",
    "sqlite3": "^4.0.2"
  }
}
```

## 3. Create a basic server.js file and make sure the server is up and running

```
const express = require('express');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Up and running...')
})

const port = 8000;

server.listen(port, function() {
    console.log(`\n--- Web API Listening on http://localhost:${port} ---\n`);
})
```

## 4. Start using knex: (a) initialize it, (b) create a user table with migrations, (c) update /migrations/[TIME_STAMP]_create_users_table

```
$ knex init

$ knex migrate:make create_users_table

exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.increments();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};

```

## 5. Create `/auth` folder: (a) fill it with `auth-1.sqlite3` (created on db browser) and (b) `db.js`

![create users table](https://ibin.co/4BN3kHMivHJW.png "Users table on db browser")

```
// db.js

const knex = require('knex');

const knexConfig = require('../knexfile.js');

module.exports = knex(knexConfig.development);
```

## 6. Update the `knexfile.js` with the appropriate `filename` and `useNullAsDefault`

```
  development: {
    client: 'sqlite3',
    connection: {
      filename: './auth/auth-1.sqlite3'
    },
    useNullAsDefault: true,
  },
```

## 7. Add `const db = require('./auth/db');` and `const bcrypt = require('bcryptjs');` to server.js

## 8. Build out the POST /register method with bcryptjs: (a) define the `/register` route, (b) hash the password, (c) save the user

```
server.post('/register', (req, res) => {

	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 14); // Auto-gen a salt and hash
	user.password = hash; // store hash in password DB

    db('users') // go into users
        .insert(user) // insert new users
        .then(ids => {
            db('users')
                .where({ id: ids[0] }) // find the appropriate user
                .first() // the first one
                .then(user => {
                    res.status(201).json(user); // return new user
                });
        })
        .catch(err => {
            res.status(500).json(err); // throw err if it fails
        });
});
```

## 9. Build out a simple GET /users method

```
server.get('/users', (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).json(err));
});
```

## 10. Build out the POST /login method: (a) set login information as `credentials = req.body`, (b) find user by email, (c) make sure `user.password` and `credentials.password` match using `compareSync`, (d) add the appropriate messages for success or error

```
server.post('/login', (req, res) => {
	const credentials = req.body;

    db('users')
        .where({email: credentials.email})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                res.send('Logged in')
            } else {
                res.status(401).json({ error: 'You shall not pass'})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});
```

## Day 2 Objectives

_**Part two, due Tuesday**_ Use `sessions` and `cookies` to keep a record of logged in users across requests.

## 1. Install the the `express-session` library and require it in server.js

```
$ yarn add express-sesson

const session = require('express-session')
```

## 2. Configure express-session middleware

```
server.use(
    session({
      name: 'monkey', // default is connect.sid
      secret: 'keyboard cat',
      cookie: { 
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
          secure: false, // flase because we're using http, true when using https
      },
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false, // forces the session to be saved back to the session store, even if the session was never modified during the request
      saveUninitialized: true,
    })
  );
```

## 3. Store session data in the `'/setname'` route handler as Frodo

```
  server.get('/setname', (req, res) => {
    req.session.name = 'Blake';
    res.send(`Session data is stored. Session name: ${req.session.name}`);
  });
```

## 4. Read session data in `'/getname'` route handler

```
server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send(`G'day ${req.session.name}!`);
  });
```

## 5. Add `req.session.email = user.email;` to verify the specific user logging in and save them as part of the session then customize the welcome message 

```
server.post('/login', (req, res) => {
	const credentials = req.body;

    db('users')
        .where({email: credentials.email})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.email = user.email; // here
                res.send(`Welcome ${user.email}`) // and here
            } else {
                res.status(401).json({ error: 'You shall not pass'})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});
```

## 6. Do the same for `/register`: (1) Add `req.session.userId = user.id;` to save the new user as part of the session and (2) customize the welcome message 

```
server.post('/register', (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 14);
	user.password = hash;

    db('users')
        .insert(user)
        .then(ids => {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    req.session.email = user.email;
                    res.send(`Welcome ${user.email}`)
                });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});
```

## 7. Use middleware to create protected routes: (1) create a `protected` function, (2) add `protected` to the route you want to protect

```
function protected (req, res, next) {
    if (req.session && req.session.email) { // if this users email === ''
        next(); // proceed to the endpoint
    } else {
        return res.status(401).json({ error: 'You shall not pass'}); // otherwise bounce em
    }};

server.get('/users', protected, (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).json(err));
});
```

## 8. Build out a GET `/logout` method by simply using `destroy` on the session

```
server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('Could not log out.');
        } else {
          res.send('Good bye for now, come back soon.');
        }
      });
    }
  });
  ```