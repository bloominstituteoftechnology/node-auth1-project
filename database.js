

/*== Database Access Helper ====================================================

Must be able to:
    Add new credentials, as username | password pairs
    Authenticate an existing credential by supplied username & password
    Return all credentials (as username only, DON'T RETURN PASSWORD)

*/

//-- Dependencies --------------------------------
const knex = require('knex');
const config = require('./config.js');
const knexConfig = require('./knexfile.js');

//-- Configure Knex Database ---------------------
const knexDB = knex(knexConfig[config.DATABASE_ENVIRONMENT]);

//-- Database Access Helper ----------------------
module.exports = {
    async addCredential(username, password) {
        await knexDB(config.TABLE_CREDENTIALS).insert({
            [config.FIELD_USERNAME]: username,
            [config.FIELD_PASSWORD]: password,
        });
        return true;
    },
    async authenticate(username, password) {
        const user = await knexDB(config.TABLE_CREDENTIALS)
            .select(config.FIELD_ID)
            .where({
                [config.FIELD_USERNAME]: username,
                [config.FIELD_PASSWORD]: password,
            })
            .first();
        return user? true : false;
    },
    async getUsers() {
        return await knexDB(config.TABLE_CREDENTIALS).select(
            config.FIELD_USERNAME
        );
    }
};
