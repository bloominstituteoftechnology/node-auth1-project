# Introduction to Authentication

Objectives

_**Part one, due Monday:**_ Use `Node.js`, `Express` and `Knex` to build an API that provides `Register` and `Login` functionality using `SQLite` to store `User` information. Make sure the password is not stored as plain text.

_**Part two, due Tuesday**_ Use `sessions` and `cookies` to keep a record of logged in users across requests.

1. Inititialize yarn

```
yarn init
```

2. Make the package.json look like so

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
    "express": "^4.16.3",
    "knex": "^0.15.2",
    "nodemon": "^1.18.3",
    "sqlite3": "^4.0.2"
  }
}
```

3. Add bcrypt.js

```
yarn add bcryptjs
```

4. Create a basic server.js file

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

5. Initialize knex and create a user table

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

6. Create `/auth/db.js`

```
const knex = require('knex');

const knexConfig = require('../knexfile.js');

module.exports = knex(knexConfig.development);
```

7. Change `knexfile.js`

```
  development: {
    client: 'sqlite3',
    connection: {
      filename: './auth/auth.sqlite3'
    },
    useNullAsDefault: true,
  },
```