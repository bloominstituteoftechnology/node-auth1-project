# Using Sessions & Cookies.

The HTTP protocol, is stateless, and thus carries no memory. This means that by default, when a page is changed, all prior info the server held regarding the client is lost, including credentials.


Sessions and Cookies are how we avoid having to login every time we change pages.

Sessions are commonly used to store information about a client in a server, that can be used for other purposes.

They allow us to create persistent data.

With sessions, each device will have a unique session.

### Authentication Workflow.

The sequence of events when using cookies and sessions are:

* Client sends credentials.
* Server verifies credentials.
* Server creates a session.
* Server generates and sends cookie to client.
* Client stores cookie.
* Client sends cookie with every request.
* Server verifies cookie.
* Server provides access to resource.

Cookies are transmitted through HTTP, because each request is composed of a _header_ and _body_.

The headers are key value pairs that include info about the request. There are standard headers, but custom ones can be added.

To send cookies, the server will add the `Set-Cookie` header, like so:
`Set-Cookie: "session=12345"`.

The value of a header is a simple string, and the browser will read this, and save a cookie with the corresponding name and value pair.

The body contains the data portion of the message.

The browser will re-add the cookie header on every request to the server.

Cookies are *not* accessible and are encrypted for security purposes.

### 1. Methods for storing session data server-side:
 * `memory`
 * `memory cache (Redis)`
 * `database (SQL!)`

### 2. Cookies:
 * `Auto-included on req's.`
 * `Unique to domain/device pairs.`
 * `Can't be sent to different domains.`
 * `Sent in header.`
 * `Can carry extra info in the body.`
 * `max size around 4kb.`


### 3. Storing session data in memory:
 * `Data stored in memory is wiped on server restarts.`
 * `Causes more memory leaks are memory is used over lifetime of application.`
 * `Good for development due to simplicity.`

 ### 4. Using Cookies to transfer session data.
 * `A cookie is a key value pair passed between the client and server, and is housed in the browser.`
 * `The server uses it to store client info.`
 * `Workflow for using cookies as session storage:`
   
   * `The server issues a cookie with an expiry time.`
   * `Browsers store the cookie and send it on every request.`
   * `The server can alter the cookie and send it back.`

`express-session` uses cookies for session management. 

### Drawbacks when using cookies
 * `Small size, at ~4KB.`
 * `Sent in every request, and can alter size of request.`
 * `If the private key is compromised, cookies can be decrypted.`

### Storing session data in Memory Cache.
 * `Stored as key value pair data in separate server.`
 * `Server uses cookie, but it only contains session id.`
 * `The memory cache server uses id to find session data.`

#### Advantages: 
 * `Quick lookups.`
 * `Decoupled from api server.`
 * `A single memory cache server can server many apps.`
 * `Automatically remove old session data.`

#### Disadvantages: 
 * `Requires managing an extra server.`
 * `Extra complexity for small apps.`
 * `Hard to reset the cache without losing all data.`