const bcrypt = require('bcryptjs');

// ******  to hash a password *******

const credentials = req.body;

const hash = bcrypt.hashSync(credentials.password, 14);

credentials.password = hash;

// move on to save the user.

// ******  to hash a password *******
const credentials = req.body;

// find the user in the database by it's username then
if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
  return res.status(401).json({ error: 'Incorrect credentials' });
}

// the user is valid, continue on

const server = express();

//hash password
const hash = bcrypt.hashSync(user.password, 14);
user.password = hash

debug('users')
    .insert(user)
    .then(function(ids) {
        db('users')
        .where({ id: ids[0] })
        .first()
        .then(user => {
            res.status(201).json(user);
        });
    })
    .catch(function(err) {
        res.status(500).json({ err });
    })
