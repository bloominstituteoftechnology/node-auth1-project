Authentication is a complex and important topic. Complex because new threats surface every day that challenge our security strategies and standards. It is important because most of our lives depend on online services and computer systems that hold our sensitive data.

authentication (AuthN) "who are you?"
when the web server verifies the identity of a client.


"what do you want?"
Authorization(AuthZ)

when the web server determines the level of access a client has to a resource


Core principles

- require strong password from the user
- Properly store passwords in the database
- Prevent brute-force attacks in the database
- still not enough to has the passwords
-time complexity by hashing over and over again until it takes too long to generate a rainbow table

rainbow tables
contains hash associated_password

 Hashing - gives protection to passwords
E.g md5 -s "hello world" function
we can create hashes from any kind of data
md5 - algoritm  has been proven to have problems


bcrypt.js algoritm - refere to documentation
 - npm install bcryptjs  

hash the password in bcryptjs we don't wan't it returning in plain text on endpoint
timestamp 42:50               

you can use hashes to identity the integrity of data
