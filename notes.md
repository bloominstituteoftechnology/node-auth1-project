client > orders (decide cascade strategy)

.onUpdate('CASCADE')
.onDelete('RESTRICT')

workflow
-user logs in
-server creates a session and provides a cookie with session info (normally an id)
-subsequent request the client send the cookie
-server checks the cookie, finds the session and provides/denies access
