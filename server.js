const express = require('express');
const mongoose = require('mongoose');
const server = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const routes = require('./user/routes');
const restrictedRoutes = require('./user/restrictedRoutes');

mongoose.connect('mongodb://localhost/SkyNetDB');

const auth = (req, res, next) => {
    const { session } = req;
    if (session.loggedIn) {
        return next();
    } else {
        res.status(401).json({ msg: 'YOU SHALL NOT PASS!' });
    }
}

server.listen(5000, () => {
    console.log('\n === SERVER LISTENING ON PORT 5000 === \n');
})

server.use(express.json());
server.use(session({
    name: 'SkyNetMountain',
    secret: 'Destroy all humans!',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions'
    })
}))

server.use('/api/restricted', auth, restrictedRoutes);
server.use('/api', routes);