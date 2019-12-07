//? s1
const server = require('./api/server.js')

//? s2
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`\n** Running on port: ${PORT} **\n`));

/* install dep
 1. npm init -y
 2. yarn 
 3. yarn add express
 4. package.json "server": "nodemon index.js"
 5.  yarn add nodemon --dev
 6. yarn add helmet --save
 7. (optional) cors: yarn add cors
 8. (intalls knex sqlite3) yarn add knex sqlite3
 9. yarn add knex-cleaner
 10. yarn add express-session
 10. yarn add connect-session-knex\
 11. yarn add dotenv

*/