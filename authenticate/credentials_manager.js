

/*== Database Access Helper ====================================================

Must be able to:
    Add new credentials, as username | password pairs
    Authenticate an existing credential by supplied username & password
    Return all credentials (as username only, DON'T RETURN PASSWORD)

*/

//-- Dependencies --------------------------------
const bcrypt = require('bcryptjs');
const config = require('../config.js');
const knexDB = require('../database.js');

//-- Configure and Export Helper -----------------
module.exports = {
    addCredential,
    authenticate ,
    getUsers     ,
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
        const [result] = await knexDB(config.TABLE_CREDENTIALS).insert({
            [config.FIELD_USERNAME]: username,
            [config.FIELD_PASSWORD]: password,
        });
        return result;
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
        const username = await prepUsername(rawUsername);
        const user = await knexDB(config.TABLE_CREDENTIALS)
            .where({
                [config.FIELD_USERNAME]: username,
            })
            .first();
        const storedHash = user[config.FIELD_PASSWORD];
        if(!comparePassword(rawPassword, storedHash)){
            return null;
        }
        return user[config.FIELD_ID];
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
