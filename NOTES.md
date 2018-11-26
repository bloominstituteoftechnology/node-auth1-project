npm init -y
.gitignore
yarn add express knex sqlite3
yarn add nodemon -D
npx knex init > generates the knexfile.js

## Add to index.js
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

## Changes, Removals, and Additions to knexfile.js
### Change filename e.g., './data/lambda.sqlite3'
### Remove

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

  ###Add to knexfile ===> useNullAsDefault: true,
