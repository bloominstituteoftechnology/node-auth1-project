

/*== Seed Credentials Table ====================================================

    Cannot Seed! Necesity to generate hashes precludes seeding at this time.

//-- Dependencies --------------------------------
const config = require('../../config.js');

//-- Initialize Table with Example Data ----------
exports.seed = function(knex, Promise) {
    return knex(config.TABLE_CREDENTIALS).del()
    .then(() => knex(config.TABLE_CREDENTIALS).insert([
        {[config.FIELD_USERNAME]: 'test', [config.FIELD_PASSWORD]: 'test'},
        {[config.FIELD_USERNAME]: 'asdf', [config.FIELD_PASSWORD]: 'jkl;'},
    ]));
};
*/
