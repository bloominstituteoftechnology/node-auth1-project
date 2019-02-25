// Local imports
const db = require('../dbConfig');
const authConst = require('./authConst');

// Attempts to create a new user entry in the database.
const register = (email, username, password) => {
    const user = {
        email: email,
        username: username,
        password: authConst.generatePasswordHash(password),
        permission: authConst.DEFAULT_ACCOUNT_PERMS
    };

    return db('users').insert(user);
};

// Returns a promise that checks if the email/passwords match.
// If resolved, returns user id.
const verify = (email, password) => {
    return db('users').where({ email: email }).select('id', 'password').first()
        .then(user => {
            // Inside this then block, we have a matching email.
            if (!authConst.checkPassword(password, user.password)) {
                return Promise.reject('Invalid credentials')
            }

            return Promise.resolve(user.id);
        })
        .catch(_ => {
            return Promise.reject('Invalid credentials');
        });
}

// Returns a promise for deleting a session.
const deleteSession = userId => {
    return db('sessions').where({ user_id: userId }).del();
}

// Returns a promise for inserting a session.
const insertSession = (userId, sessionKey) => {
    const entry = {
        user_id: userId,
        session_key: sessionKey,
        expire_date: authConst.getExpireDate()
    };

    return db('sessions').insert(entry);
}

// Checks if there is a valid session for this user id, and returns it.
// Otherwise, returns a new session.
const getSessionKey = userId => {
    return db('sessions').where({ user_id: userId }).first()
        .then(result => {
            if (result.expire_date && !authConst.isDateExpired(result.expire_date)) {
                // If the existing key hasn't expired, just use it.
                return Promise.resolve(result.session_key);
            }

            // Delete the expired entry. 
            return deleteSession(userId)
                .then(_ => {
                    // Generate a new session.
                    let key = authConst.generateSessionKey();
                    return insertSession(userId, key)
                        .then(_ => {
                            return Promise.resolve(key);
                        });
                });
                
        })
        .catch(_ => {
            // Generate a new session.
            let key = authConst.generateSessionKey();
            return insertSession(userId, key)
                .then(_ => {
                    return Promise.resolve(key);
                });
        })
}

// Attempts to create a new session.
// If a session is valid and exists, return that session key.
// Otherwise, create a new session key.
const login = (email, password) => {
    return verify(email, password)
        .then(id => {
            return getSessionKey(id);
        });
};

// Checks if a specified session key exists, is not expired, and meets the permission requirement.
const isAuthorized = (sessionKey, requirement) => {
    return db('sessions').where({ session_key: sessionKey }).first()
        .then(session => {
            return db('users').where({ id: session.user_id }).select('permission').first()
                .then(user => {
                    return authConst.permsAuthorized(user.permission, requirement) ? Promise.resolve() : Promise.reject('Unauthorized');
                })
                .catch(err => {
                    return Promise.reject(`Could not load user permission! [${err}]`);
                });
        })
        .catch(err => {
            return Promise.reject(`Could not load user session key! [${err}]`);
        });
};

// Module exports
module.exports = {
    register,
    login,
    isAuthorized
};
