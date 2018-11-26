const server = require('./api/server.js');
const db = require('./database/dbConfig.js');

const bcrypt = require('bcryptjs');

const port = 9000;

server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));

server.post('/api/register', (req, res) => {
  //grab username and password from body
  const creds = req.body;
  //generate the hash from the user's password
  const hash = bcrypt.hashSync(creds.password, 14);
  //override the password with the hash
  creds.password = hash;
  //save the user to the database.
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => console.log(err));
});

server.post('/api/login', (req, res) => {
  //grab username and password from body
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // passwords match and user exists by that username
        res.status(200).json({ message: 'welcome!' });
      } else {
        res.status(401).json({ message: 'You shall not pass!!' });
      }
    })
    .catch(err => res.json(err));
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.json(err));
});
