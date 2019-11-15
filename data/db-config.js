const knex=require('knex'),
config=require('../knexfile');

knex.use(config.development);