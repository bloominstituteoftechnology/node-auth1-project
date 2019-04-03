HTTPS is stateless, we use sessions and tokens to make it fake-stateful.

Main difference is where the state is kept:
- sessions: server
- tokens: client via the token

Responsibilities:

Server
- produce token
- send token
- read, decode, verify
- make payload available to the server

Client
- store the token
- send token on every request
- destroy the token on logout