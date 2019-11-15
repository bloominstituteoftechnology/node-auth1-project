const knex=require('knex'),
config=require('../knexfile');

knex.use(config.development);

module.exports=knex;