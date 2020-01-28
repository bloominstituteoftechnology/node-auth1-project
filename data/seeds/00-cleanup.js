const knexCleaner = require('knex-cleaner');

exports.seed = function(knex) {
  return knexCleaner.clean(knex, {
    mode: 'truncate',
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  });
};
