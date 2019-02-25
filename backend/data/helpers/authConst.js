// Package imports
const moment = require('moment');
const bcrypt = require('bcrypt');

// Represents a route/resource that only requires a valid session key.
const ANY = 0;

// Represents a route/resource that requires basic user permissions.
const USER = 1;

// Represents a route/resource that requires elevated trusted user permissions.
const TRUSTED_USER = 2;

// Represents a route/resource that requires administrator permissions.
const ADMIN = 100;

// Represents the default permissions given to a user upon registration.
const DEFAULT_ACCOUNT_PERMS = USER;

// Represents the number of rounds (exponential) for bcrypt cost.
const DEFAULT_BCRYPT_ROUNDS = 16;

// Generates a hash of a password.
const generatePasswordHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(DEFAULT_BCRYPT_ROUNDS));
}

// Checks a password guess against its hashed form.
const checkPassword = (passwordTry, hashed) => {
    return bcrypt.compareSync(passwordTry, hashed);
}

// Checks if a permission level is authorized against a specific requirement.
const permsAuthorized = (perms, requirement) => {
    return perms >= requirement;
}

// Gets the expiration date for a session being created now.
// You may specify a date to override the default behaviour of using now's time.
// Dates are in UTC.
const getExpireDate = date => {
    if (!date)
        return moment.utc().add(5, 'minutes').toDate();
    else
        return moment.utc(date).add(5, 'minutes').toDate();
}

// Checks an expire_date to see if it is expired.
const isDateExpired = date => {
    return moment.utc(date).isBefore(moment.utc());
}

// Generates a new session key.
const generateSessionKey = _ => {
    return crypto.randomBytes(96).toString('hex');
}

// Export the consts for use in other files
module.exports = {
    ANY,
    USER,
    TRUSTED_USER,
    ADMIN,
    DEFAULT_ACCOUNT_PERMS,
    DEFAULT_BCRYPT_ROUNDS,
    generatePasswordHash,
    checkPassword,
    permsAuthorized,
    getExpireDate,
    isDateExpired,
    generateSessionKey
};
