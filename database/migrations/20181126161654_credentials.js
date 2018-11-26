

//== Credentials Table =========================================================

//-- Dependencies --------------------------------
const config = require('../../config.js');

//-- Create Table --------------------------------
exports.up = function(knex, Promise) {
    return knex.schema.createTable(config.TABLE_CREDENTIALS, table => {
        table
            .increments();
        table
            .string(config.FIELD_USERNAME, config.LIMIT_USERNAME)
            .notNullable()
            .unique();
        table
            .string(config.FIELD_PASSWORD, config.LIMIT_PASSWORD)
            .notNullable();
    });
};

//-- Destroy Table -------------------------------
exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(config.TABLE_CREDENTIALS);
};
