module.exports = {
  secret: 'super secret', // ?
  cookie: {
    // maxAge: 1000 * 60 * 60, // an hour : life expand of the cookie -> session diration
    maxAge: 10 * 1000, // n-seconds
  },
  httpOnly: true, // only available with HTTP connections
  secure: false, // allow non HTTPS connection
  resave: true, // ?
  saveUninitialized: false, // ?
  name: 'noname', // name os the cookie --> preferable to be something no related to a session cookie.
};
