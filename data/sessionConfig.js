const sessionConfig = {
  secret: '780d987gsdf09g87ds09guioerhu3lhlghdf9g3eohweohuwqhoiuhfoui984houhoewiuhhfjkdiuoe893oauihouhlsd',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false // only set it over https; in production you want this to be true
  },
  httpOnly: true, // no js can touch this cookie
  resave: false,
  saveUninitialized: false
}

module.exports = sessionConfig;