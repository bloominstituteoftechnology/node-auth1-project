// WEB API ARCHITECTURE
// ==============================================
const app = require('express')();

require('./API/middleware')(app);
require('./API/routes')(app);

const port = process.env.PORT || 3300;

// START THE WEB API
// ==============================================
app.listen(port, () => console.log(`\n=== Web API listening on http://localhost:${port} ===\n`));
