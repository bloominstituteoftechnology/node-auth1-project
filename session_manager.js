

//== Session Manager ===========================================================

//-- Dependencies --------------------------------
const expressSession     = require('express-session'     );
const connectSessionKnex = require('connect-session-knex');
const config              = require('./config.js'               );
const secureSessionConfig = require('./secure/session_config.js');
const database            = require('./database.js'             );

//-- Configure and Export Session Store ----------
const KnexSessionStore   = connectSessionKnex(expressSession);
const storeConfig = {
    name             : secureSessionConfig.SESSION_NAME,
    secret           : secureSessionConfig.SESSION_SECRET,
    httpOnly         : true,
    resave           : false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.SESSION_MAXAGE,
        secure: false,
    },
    store: new KnexSessionStore({
        knex         : database,
        tablename    : config.TABLE_SESSION,
        sidfieldname : config.FIELD_SESSIONID,
        createtable  : true,
        clearInterval: config.SESSION_CLEARINTERVAL,
    }),
};
module.exports = expressSession(storeConfig);

/*

server.post('/api/login', (req, res) => {
  // grab username and password from body
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // passwords match and user exists by that username
        req.session.user = user.id;
        res.status(200).json({ message: 'welcome!' });
      } else {
        // either username is invalid or password is wrong
        res.status(401).json({ message: 'you shall not pass!!' });
      }
    })
    .catch(err => res.json(err));
});


//------------------------------------------------
function protected(req, res, next) {
  if (req.session && req.session.user) {
    // they're logged in, go ahead and provide access
    next();
  } else {
    // bounce them
    res.status(401).json({ you: 'shall not pass!!' });
  }
}




//------------------------------------------------
// protect this route, only authenticated users should see it
server.get('/api/me', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password') // ***************************** added password to the select
    .where({ id: req.session.user })
    .first()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password') // ***************************** added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('you can never leave');
      } else {
        res.send('bye');
      }
    });
  } else {
    res.end();
  }
});
*/