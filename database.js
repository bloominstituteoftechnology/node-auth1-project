

/*== Database Access Helper ====================================================

Must be able to:
    Add new credentials, as username | password pairs
    Authenticate an existing credential by supplied username & password
    Return all credentials (as username only, DON'T RETURN PASSWORD)

*/

//-- Dependencies --------------------------------
const knex = require('knex');
const bcrypt = require('bcryptjs');
const config = require('./config.js');
const knexConfig = require('./knexfile.js');

//-- Configure and Export Helper -----------------
const knexDB = knex(knexConfig[config.DATABASE_ENVIRONMENT]);
module.exports = {
    addCredential: addCredential,
    authenticate : authenticate ,
    getUsers     : getUsers     ,
};

//== Database Utilities ========================================================

//-- Transform Username to Canonical form --------
function prepUsername(raw) {
    return raw.toLowerCase();
}

//-- Hash Password -------------------------------
function prepPassword(raw) {
    return bcrypt.hashSync(raw, config.PASSWORD_HASH_DEPTH);
}

//-- Compare Password to Hash --------------------
function comparePassword(raw, storedHash) {
    return bcrypt.compareSync(raw, storedHash);
}

//== Database Access Functions =================================================

//-- Add Credential ------------------------------
async function addCredential(rawUsername, rawPassword) {
    try {
        let username = prepUsername(rawUsername);
        let password = prepPassword(rawPassword);
        // Check for previous users
        const priorUser = await knexDB(config.TABLE_CREDENTIALS)
            .select(config.FIELD_ID)
            .where({
                [config.FIELD_USERNAME]: username,
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
async function authenticate(rawUsername, rawPassword) {
    try {
        let username = await prepUsername(rawUsername);
        let storedHash = await knexDB(config.TABLE_CREDENTIALS)
            .select(config.FIELD_PASSWORD)
            .where({
                [config.FIELD_USERNAME]: username,
            })
            .first();
        storedHash = storedHash[config.FIELD_PASSWORD];
        return comparePassword(rawPassword, storedHash);
    }
    catch(error) {
        throw config.ERROR_DATABASE_INTERNAL;
    }
}

//-- Get Users -----------------------------------
async function getUsers() {
    // Dot not return passwords or password hashes!
    /* Only doing it here as this is an example project, and we want to view the
        generated hashes. */
    try {
        return await knexDB(config.TABLE_CREDENTIALS).select(
            config.FIELD_USERNAME,
            config.FIELD_PASSWORD,
        );
    }
    catch(error) {
        throw config.ERROR_DATABASE_INTERNAL;
    }
}
