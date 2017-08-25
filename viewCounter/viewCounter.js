const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const server = express();
server.use(bodyParser.json());

server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
}));

server.get('/view-counter', (req, res) => {
  const persistentSession = req.session;
  if (!persistentSession.viewCount) {
    persistentSession.viewCount = 0;
  }
  persistentSession.viewCount++;
  res.json({ viewCount: persistentSession.viewCount });
});

module.exports = { server };

server.listen(3000);
