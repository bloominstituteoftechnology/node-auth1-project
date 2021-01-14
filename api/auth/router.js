const bcrypt = require('bcryptjs');
const router = require('express').Router();

const Users = require('./users-model');

const validateSession = require('./middleware');

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(() => {
            res.status(500);
        })
})

router.post('/register', validateCredentials(), async (req, res) => {
    const { credentials } = req;

    const hash = await bcrypt.hash(credentials.password, 10);
    req.credentials.password = hash;

    Users.add(credentials)
        .then(newUser => {
            const { user_id, username } = newUser;
            res.status(201).json({ user_id, username });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "There has been an error..."
            })
        })
})

router.post('/login', validateCredentials(), (req, res) => {
    const { credentials } = req;

    Users.findByUsername(credentials.username)
        .then(async user => {
            const passwordValid = await bcrypt.compare(credentials.password, user.password)
            if (!user || !passwordValid) {
                return res.status(404).json({
                    message: "Invalid crdentials"
                });
            }

            req.session.user = user;
            res.status(200).json({
                message: "Logged in",
            })
        })
        .catch(() => {
            res.status(500).json({
                message: "You shall not pass!"
            })
        })

})

router.get('/users', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(() => {
            res.status(500).json({
                message: "An error has occurred..."
            })
        })
})

// LOCAL MIDDLEWARE //
function validateCredentials() {
    return function (req, res, next) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Missing required field. Required fields {username, password}"
            })
        }

        req.credentials = {
            username,
            password
        }

        next();
    }
}

module.exports = router;