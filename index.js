// //Assignment:
// // Part one, due Monday: Use Node.js, Express and Knex to build an API 
// // that provides Register and Login functionality using SQLite to store 
// // User information. Make sure the password is not stored as plain text.
// // Part two, due Tuesday: Use sessions and cookies to keep a record of logged in users across requests.

// // --------------NOTES ON AUTHENTICATION--------------

// // *******Authentication Workflow for sessions********
// // The basic workflow when using a combination of cookies and sessions for authentication is:
// // *  client sends credentials.
// // *  server verify credentials.
// // *  server creates a session for the client.
// // *  server produces and sends back cookie.
// // *  client stores the cookie.
// // *  client sends cookie on every request.
// // *  server verifies that cookie is valid.
// // *  server provides access to resource.

// //********Cookies****************//
// // Sessions can store their information in different ways. 
// // One popular way to store session data is in cookies.   
// // A cookie is usually a small piece of data that gets sent between a web server to your web browser. It allows the server to store information relevant to a specific user.
// // Cookies are used to store session data in the following way: 
// // * 1) The server issues a cookie that gets sent to the web browser and stored for a period of time (called the expiration time).
// // * 2) The server issues a cookie that gets sent to the web browser and stored for a period of time (called the expiration time).
// // * 3) The server can manipulate the cookie if it needs to, and then sends it back to the browser.

// // Cookies are: 
// // * automatically included on every request.
// // * unique to each domain + device pair
// // * unique to each domain + device pair
// // * sent in the cookey header


// // To understand how cookies are transmitted and stored in the browser we need to look at the basic structure of and HTTP message. Every HTTP message, be it a request or a response, has two main parts: the headers and the body.
// // * To send cookies the server will add the Set-Cookie header to the response like so: "Set-Cookie": "session=12345". The body contains the data portion of the message.
// // * The browser will read the header and save a cookie called session with the value 12345 in this example. We will use a library that takes care of creating and sending the cookie.
// // Browsers automatically store the cookie and send it on every request to the same domain.
// // Cookies are not accessible from JavaScript or anywhere, they are cryptographically signed. Very secure.

// const express = require('express');

// // server library for handling sessions in Node.js
// const session = require('express-session');

// const bcrypt = require('bcryptjs');
// const knex = require('knex');
// const knexConfig = require('./knexfile');

// // We use the db constant to interact with our database.
// const db = knex(knexConfig.development);

// const server = express();
// server.use(express.json());

// // This middleware verifies that we have a session and that the username is set. We could use userId or any other value we can use to verify access to a resource.
// function protected(req, res, next) {
//     if (req.session && req.session.username === 'adrian') {
//       next();
//     } else {
//       res.status(401).json({ message: 'Incorrect credentials' });
//     }
//   }

//   function roles(req,res,next) {
//       return function(roles) {
//           if (req.session && req.session.username == 'adrian') {
//               // "find the user in the db by the user id in the cookie"
//               // "check that the user has one of the roles allowed"
//               next();
//           } else {
//               return res.status(401).json({error: "Incorrect credentials"})
//           }
//       };
//   }


// // configure express-session middleware
// server.use(
//     session({
//         name: "bloop sesh",  // default is connect.sid
//         secret: "bleep bleep", //this won't be in production code. for development, OK.
//         cookie: {
//             maxAge: 1*24*60*60*1000, //one day in milliseconds. 
//             secure:false //only set cookies over https. server will not send back a cookie over http. QQQQQ????: Why did prof change this from true to false?
//         } , 
//         httpOnly: true,  //don't let JS code access cookies. Browser extensions run JS code on your browser!
//         resave: false, 
//         saveUninitialized:true // QQQQQ????: Why did prof change this from false to true?
//     })
// )

// server.get('/', (req,res) =>{
//     res.send('Server up and running.');
// });

// server.get('/setname', (req, res) => {
//     req.session.name = 'adrian';
//     res.send('done');
// })

// server.get('/getname', (req,res) => {
//     const name = req.session.name;
//     res.send(`hello ${req.session.name}`);
// })

// // // to hash a password
// // const credentials = req.body;
// // const hash = bcrypt.hashSync(credentials.password, 14);
// // credentials.password = hash;

// // //to verify a password
// // const credentials = req.body;

// // //find the user in the database by it's username then
// // if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
// //     return res.status(401).json({error: 'Incorrect credentials'});
// // }

// // // the user is valid, continue on


// //Endpoints
// // Method	Endpoint	    Description
// // POST	    /api/register	Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
// // POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'
// // GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.


// // Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
// // After the user registers, the server sends a cookie back. 
// server.post('/api/register', (req,res) => {
//     const user = req.body; 

//     //hash password
//     const hash = bcrypt.hashSync(user.password, 10);
//     user.password = hash;

//     db('users')
//         .insert(user)
//         // .then(ids => {
//         .then(function(ids) {
//             db('users')
//                 .where({id: ids[0]})
//                 .first()
//                 .then(user => {
//                     req.session.username = user.username
//                     res.status(201).json(user);
//                 });
//         })
//         .catch(err => res.status(500).json({err}));
// });



// // POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. 
// //                          On successful login, create a new session for the user and send back 
// //                          a 'Logged in' message and a cookie that contains the user id. If login fails, 
// //                          respond with the correct status code and the message: 'You shall not pass!'


// server.post('/api/login', (req,res) => {
//     //to verify a password
//     const credentials = req.body;
    
//     db('users')
//         .where({username:credentials.username})
//         .first()
//         .then(function(user) { //where would be a good place to save some session information to send back a cookie? We do it directly after the line below because at that point we know the user logged in with the correct credentials. 
//             if (user && bcrypt.compareSync(credentials.password, user.password)) {
//                 req.session.username = user.username; //What would be useful for me when a user comes back? What info would be useful to me to decide whether to give them access to a particular resource. What we're going to do is to protect the user's resource. We're going to make it so only a particular user can access the resource. We can use the username or userId to do that. We save it so we can check for that later.  
//                 res.send(`welcome ${user.username}`);
//             } else {
//                 return res.status(401).json({error: 'Incorrect credentials'});
//             }
//         })
//         .catch(error => {
//             res.status(500).json({error});
//         })

//      //  // from tk notes
//     // //find the user in the database by it's username then
//     // if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
//     //     return res.status(401).json({error: 'Incorrect credentials'});
//     // }

//     // db.insert()
// });


// // GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.

// server.get('/api/users', protected, (req, res) => {
//     db('users')
//         .then(users => {
//             res.json(users);
//         })
//         .catch(err => res.send(err));
// });


// server.listen(3300, () => console.log('Running on port 3300'));





// //****** ABOVE CODE WASN'T WORKING. I USED MY OLD CODE THAT WAS WORKING TO COMPARE THE ABOVE TO THE WORKING CODE. TURNS OUT THAT I GOT AN ERROR BECAUSE I REPEATED A USERNAME. :-(   ******
// // ***********AFTER GETTING LOGIN WORKING AND FAILING TO BRING UP /api/users, LOGIN NOT WORKING. 
// //*****BELOW IS MY ORIGINAL CODE  ***********/

// //Assignment:
// // Part one, due Monday: Use Node.js, Express and Knex to build an API 
// // that provides Register and Login functionality using SQLite to store 
// // User information. Make sure the password is not stored as plain text.
// // Part two, due Tuesday: Use sessions and cookies to keep a record of logged in users across requests.

// //WORKING CODE
// const express = require('express');
// const session = require('express-session');
// const bcrypt = require('bcryptjs');
// const knex = require('knex');
// const knexConfig = require('./knexfile');

// // We use the db constant to interact with our database.
// const db = knex(knexConfig.development);

// const server = express();
// server.use(express.json());
// // WORKING CODE ENDS


// // // //NON-WORKING CODE
// // const express = require('express');

// // // server library for handling sessions in Node.js
// // const session = require('express-session');

// // const bcrypt = require('bcryptjs');
// // const knex = require('knex');
// // const knexConfig = require('./knexfile');

// // // We use the db constant to interact with our database.
// // const db = knex(knexConfig.development);

// // const server = express();
// // server.use(express.json());
// // // //NON-WORKING CODE ENDS


// //WORKING CODE
// // This middleware verifies that we have a session and that the userId is set. We could use username or any other value we can use to verify access to a resource.
// function protected(req, res, next) {
//     if (req.session && req.session.username === 'bleep') {
//       next();
//     } else {
//       res.status(401).json({ message: 'Incorrect credentials' });
//     }
//   }

//   function roles(req,res,next) {
//       return function(roles) {
//           if (req.session && req.session.username == 'bleep') {
//               // "find the user in the db by the user id in the cookie"
//               // "check that the user has one of the roles allowed"
//               next();
//           } else {
//               return res.status(401).json({error: "Incorrect credentials"})
//           }
//       };
//   }
// // WORKING CODE ENDS

// // // //NON-WORKING CODE 
// // // This middleware verifies that we have a session and that the username is set. We could use userId or any other value we can use to verify access to a resource.
// // function protected(req, res, next) {
// //     if (req.session && req.session.username === 'adrian') {
// //       next();
// //     } else {
// //       res.status(401).json({ message: 'Incorrect credentials' });
// //     }
// //   }

// //   function roles(req,res,next) {
// //       return function(roles) {
// //           if (req.session && req.session.username == 'adrian') {
// //               // "find the user in the db by the user id in the cookie"
// //               // "check that the user has one of the roles allowed"
// //               next();
// //           } else {
// //               return res.status(401).json({error: "Incorrect credentials"})
// //           }
// //       };
// //   }
// // // //NON-WORKING CODE ENDS


// // // WORKING CODE 
// // configure express-session middleware
// server.use(
//     session({
//         name: "bloop sesh", 
//         secret: "bleep bleep", //this won't be in production code. for development, OK.
//         cookie: {
//             maxAge: 1*24*60*60*1000, //one day in milliseconds. 
//             secure:false //only set cookies over https. server will not send back a cookie over http. QQQQQ????: Why did prof change this from true to false?
//         } , 
//         httpOnly: true,  //don't let JS code access cookies. Browser extensions run JS code on your browser!
//         resave: false, 
//         saveUninitialized:true // QQQQQ????: Why did prof change this from false to true?
//     })
// )
// // // WORKING CODE ENDS


// // // //NON-WORKING CODE 
// // // configure express-session middleware
// // server.use(
// //     session({
// //         name: "bloop sesh",  // default is connect.sid
// //         secret: "bleep bleep", //this won't be in production code. for development, OK.
// //         cookie: {
// //             maxAge: 1*24*60*60*1000, //one day in milliseconds. 
// //             secure:false //only set cookies over https. server will not send back a cookie over http. QQQQQ????: Why did prof change this from true to false?
// //         } , 
// //         httpOnly: true,  //don't let JS code access cookies. Browser extensions run JS code on your browser!
// //         resave: false, 
// //         saveUninitialized:true // QQQQQ????: Why did prof change this from false to true?
// //     })
// // )
// // // //NON-WORKING CODE ENDS


// // //WORKING CODE 
// server.get('/', (req,res) =>{
//     res.send('Server up and running.');
// });

// server.get('/setname', (req, res) => {
//     req.session.name = 'bleep';
//     res.send('done');
// })

// server.get('/getname', (req,res) => {
//     const name = req.session.name;
//     res.send(`hello ${req.session.name}`);
// })
// // //WORKING CODE ENDS


// // // //NON-WORKING CODE 
// // server.get('/', (req,res) =>{
// //     res.send('Server up and running.');
// // });

// // server.get('/setname', (req, res) => {
// //     req.session.name = 'adrian';
// //     res.send('done');
// // })

// // server.get('/getname', (req,res) => {
// //     const name = req.session.name;
// //     res.send(`hello ${req.session.name}`);
// // })
// // // //NON-WORKING CODE ENDS

// // // WORKING CODE
// // // to hash a password
// // const credentials = req.body;
// // const hash = bcrypt.hashSync(credentials.password, 14);
// // credentials.password = hash;

// // //to verify a password
// // const credentials = req.body;

// // //find the user in the database by it's username then
// // if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
// //     return res.status(401).json({error: 'Incorrect credentials'});
// // }

// // // the user is valid, continue on
// // // WORKING CODE ENDS

// // //NON-WORKING CODE 
// // //to hash a password
// // const credentials = req.body;
// // const hash = bcrypt.hashSync(credentials.password, 14);
// // credentials.password = hash;

// //to verify a password
// // const credentials = req.body;
 
// // //find the user in the database by it's username then
// // if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
// //     return res.status(401).json({error: 'Incorrect credentials'});
// // }

// // the user is valid, continue on
// // //NON-WORKING CODE ENDS


// //Endpoints
// // Method	Endpoint	    Description
// // POST	    /api/register	Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
// // POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'
// // GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.


// // Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
// // server.post('/api/register', (req,res) => {
// //     const user = req.body; 

// //     //hash password
// //     const hash = bcrypt.hashSync(user.password, 10);
// //     user.password = hash;

// //     db('users')
// //         .insert(user)
// //         .then(ids => {
// //             db('users')
// //                 .where({id: ids[0]})
// //                 .first()
// //                 .then(user => {
// //                     req.session.username = user.username
// //                     res.status(201).json(user);
// //                 });
// //         })
// //         .catch(err => res.status(500).json({err}));
// // });

// server.post('/api/register', (req,res) => {
//     const user = req.body; 

//     //hash password
//     const hash = bcrypt.hashSync(user.password, 10);
//     user.password = hash;

//     db('users')
//         .insert(user)
//         // .then(ids => {
//         .then(function(ids) {
//             db('users')
//                 .where({id: ids[0]})
//                 .first()
//                 .then(user => {
//                     req.session.username = user.username
//                     res.status(201).json(user);
//                 });
//         })
//         .catch(err => res.status(500).json({err}));
// });


// // POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. 
// //                          On successful login, create a new session for the user and send back 
// //                          a 'Logged in' message and a cookie that contains the user id. If login fails, 
// //                          respond with the correct status code and the message: 'You shall not pass!'
// server.post('/api/login', (req,res) => {
//     //to verify a password
//     const credentials = req.body;
    
//     db('users')
//         .where({username:credentials.username})
//         .first()
//         .then(function(user) {
//             if (user && bcrypt.compareSync(credentials.password, user.password)) {
//                 req.session.username = user.username;
//                 res.send(`welcome ${user.username}`);
//             } else {
//                 return res.status(401).json({error: 'Incorrect credentials'});
//             }
//         })
//         .catch(error => {
//             res.status(500).json({error});
//         })

//      //  // from tk notes
//     // //find the user in the database by it's username then
//     // if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
//     //     return res.status(401).json({error: 'Incorrect credentials'});
//     // }

//     // db.insert()
// });


// // GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.

// server.get('/api/users', protected, (req, res) => {
//     db('users')
//         .then(users => {
//             res.json(users);
//         })
//         .catch(err => res.send(err));
// });


// server.listen(3300, () => console.log('Running on port 3300'));





// // CODE THAT WAS ORIGINALLY WORKING. LOGIN NOT WORKING DON'T KNOW WHY. 
//Assignment:
// Part one, due Monday: Use Node.js, Express and Knex to build an API 
// that provides Register and Login functionality using SQLite to store 
// User information. Make sure the password is not stored as plain text.
// Part two, due Tuesday: Use sessions and cookies to keep a record of logged in users across requests.

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile');

// We use the db constant to interact with our database.
const db = knex(knexConfig.development);

const server = express();
server.use(express.json());

// This middleware verifies that we have a session and that the userId is set. We could use username or any other value we can use to verify access to a resource.
function protected(req, res, next) {
    if (req.session && req.session.username === 'bleep') {
      next();
    } else {
      res.status(401).json({ message: 'Incorrect credentials' });
    }
  }

  function roles(req,res,next) {
      return function(roles) {
          if (req.session && req.session.username == 'bleep') {
              // "find the user in the db by the user id in the cookie"
              // "check that the user has one of the roles allowed"
              next();
          } else {
              return res.status(401).json({error: "Incorrect credentials"})
          }
      };
  }


// configure express-session middleware
server.use(
    session({
        name: "bloop sesh", 
        secret: "bleep bleep", //this won't be in production code. for development, OK.
        cookie: {
            maxAge: 1*24*60*60*1000, //one day in milliseconds. 
            secure:false //only set cookies over https. server will not send back a cookie over http. QQQQQ????: Why did prof change this from true to false?
        } , 
        httpOnly: true,  //don't let JS code access cookies. Browser extensions run JS code on your browser!
        resave: false, 
        saveUninitialized:true // QQQQQ????: Why did prof change this from false to true?
    })
)

server.get('/', (req,res) =>{
    res.send('Server up and running.');
});

server.get('/setname', (req, res) => {
    req.session.name = 'bleep';
    res.send('done');
})

server.get('/getname', (req,res) => {
    const name = req.session.name;
    res.send(`hello ${req.session.name}`);
})

// // to hash a password
// const credentials = req.body;
// const hash = bcrypt.hashSync(credentials.password, 14);
// credentials.password = hash;

// //to verify a password
// const credentials = req.body;

// //find the user in the database by it's username then
// if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
//     return res.status(401).json({error: 'Incorrect credentials'});
// }

// // the user is valid, continue on


//Endpoints
// Method	Endpoint	    Description
// POST	    /api/register	Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
// POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'
// GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.


// Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
server.post('/api/register', (req,res) => {
    const user = req.body; 

    //hash password
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    db('users')
        .insert(user)
        .then(ids => {
            db('users')
                .where({id: ids[0]})
                .first()
                .then(user => {
                    req.session.username = user.username
                    res.status(201).json(user);
                });
        })
        .catch(err => res.status(500).json({err}));
});



// POST	    /api/login	    Use the credentials sent inside the body to authenticate the user. 
//                          On successful login, create a new session for the user and send back 
//                          a 'Logged in' message and a cookie that contains the user id. If login fails, 
//                          respond with the correct status code and the message: 'You shall not pass!'
server.post('/api/login', (req,res) => {
    //to verify a password
    const credentials = req.body;
    
    db('users')
        .where({username:credentials.username})
        .first()
        .then(function(user) {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.username = user.username;
                res.send(`welcome ${user.username}`);
            } else {
                return res.status(401).json({error: 'Incorrect credentials'});
            }
        })
        .catch(error => {
            res.status(500).json({error});
        })

     //  // from tk notes
    // //find the user in the database by it's username then
    // if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
    //     return res.status(401).json({error: 'Incorrect credentials'});
    // }

    // db.insert()
});


// GET	    /api/users	    If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.

server.get('/api/users', protected, (req, res) => {
    db('users')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});


server.listen(3300, () => console.log('Running on port 3300'));