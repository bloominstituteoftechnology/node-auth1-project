const sessionConfig = {
  name: 'sessionAuth',
  secret: process.env.SESSION_SECRET || 'Pneumonoultramicroscopicsilicovolcanoconiosis',
  resave: false,
  saveUninitialized: process.env.SEND_COOKIES || true,
  cookie: {
    maxAge: 1000 * 30, // 30 seconds
    // maxAge: 1000 * 60 * 10, // 10mins
    secure: process.env.USE_COOKIE_SECURE || false, // https or http
    httpOnly: true
  },
};

module.exports = sessionConfig;