

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

//-- Configure and Export Helper -----------------
const knexDB = knex(knexConfig[config.DATABASE_ENVIRONMENT]);
module.exports = {
    addCredential: addCredential,
    authenticate : authenticate,
    getUsers     : getUsers,
};


//== Database Access Functions =================================================

//-- Add Credential ------------------------------
async function addCredential(username, password) {
    try {
        // Check for previous users
        const priorUser = await knexDB(config.TABLE_CREDENTIALS)
            .select(config.FIELD_ID)
            .where({
                [config.FIELD_USERNAME]: username
            })
            .first();
        if(priorUser){
            throw config.ERROR_AUTHENTICATION_NAMETAKEN;
        }
        // Insert new user
        await knexDB(config.TABLE_CREDENTIALS).insert({
            [config.FIELD_USERNAME]: username,
            [config.FIELD_PASSWORD]: password,
        });
        return true;
    }
    catch(error) {
        if(error === config.ERROR_AUTHENTICATION_NAMETAKEN){
            throw error;
        }
        throw config.ERROR_DATABASE_INTERNAL;
    }
}

//-- Authenticate --------------------------------
async function authenticate(username, password) {
    try {
        const user = await knexDB(config.TABLE_CREDENTIALS)
            .select(config.FIELD_ID)
            .where({
                [config.FIELD_USERNAME]: username,
                [config.FIELD_PASSWORD]: password,
            })
            .first();
        return user? true : false;
    }
    catch(error) {
        throw config.ERROR_DATABASE_INTERNAL;
    }
}

//-- Get Users -----------------------------------
async function getUsers() {
    try {
        return await knexDB(config.TABLE_CREDENTIALS).select(
            config.FIELD_USERNAME
        );
    }
    catch(error) {
        throw config.ERROR_DATABASE_INTERNAL;
    }
}
