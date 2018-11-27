module.exports = {
  name: 'monkey',
  secret: 'asfjaofuwruq04r3oj;ljg049fjq30j4jlajg40j40tjojasl;kjg',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, // only set it over https; in production you want this true.
  },
  httpOnly: true, // no js can touch this cookie
  resave: false,
  saveUninitialized: false,
};