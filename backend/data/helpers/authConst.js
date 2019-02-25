// Package imports
const moment = require('moment');

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

// Export the consts for use in other files
module.exports = {
    ANY,
    USER,
    TRUSTED_USER,
    ADMIN,
    DEFAULT_ACCOUNT_PERMS,
    permsAuthorized,
    getExpireDate
};
