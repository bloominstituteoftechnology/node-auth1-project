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
