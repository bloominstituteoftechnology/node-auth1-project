

//== Seed Credentials Table ====================================================

//-- Dependencies --------------------------------
const config = require('../../config.js');

//-- Initialize Table with Example Data ----------
exports.seed = function(knex, Promise) {
    return knex(config.TABLE_CREDENTIALS).del()
    .then(() => knex(config.TABLE_CREDENTIALS).insert([
        {
            [config.FIELD_USERNAME]: 'test',
            [config.FIELD_PASSWORD]: '$2a$04$V2NVQ0uvMkLwIUrha9rfteMR.HS.mvDJVEsoH19lVNoYa5CDjyXu6'
        },
    ]));
};
