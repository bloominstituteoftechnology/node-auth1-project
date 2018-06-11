/* Dependencies */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
// My mLabs DB <3
const MONGO_URI = require('./config');
// Routes
const userRoutes = require('./user/userRoutes');

/* Middleware Functions */
const checkAuth = (req, res, next) => {
  req.session.id 
  ? 
    next() 
  : 
    res.status(403).json({ error: "Please login to view the site" });
}
/* Server and General Middleware */
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
  secret: `What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.`
}));
server.use('/api/restricted', checkAuth)

/* Mongoose */
mongoose.connect(MONGO_URI)
  .then(_ => console.log("\n*** Connected to mLabs MongoDB ***\n"))
  .catch(err => console.log(err));

/* Routes */
server.get('/', (req, res) => {
  res.status(200).json({ api: '--- API running ---'});
});

server.get('/api/restricted', (req, res) => {
  res.status(200).json({ message: "Connection Successful" });
})

server.use('/api', userRoutes);

/* Server Start */
const port = 5000;
server.listen(port, () => console.log(`\n === Server is listening at ${port} ===\n`));