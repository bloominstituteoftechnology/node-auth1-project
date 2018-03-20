const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../src/server.js');
const User = require('../src/user.js');

const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';

const USERS_PATH = '/users';
const LOG_IN_PATH = '/log-in';
const ME_PATH = '/me';

// allows us to make and test HTTP requests
chai.use(chaiHTTP);

const expect = chai.expect;

/* Expects the status code expected from the given response, res. Throws
 * a useful error message if the expectation is not met. The request
 * method is used to improve error messages. */
const expectStatus = (expected, method, path, res) => {
  // We assume the status *isn't* expected to be STATUS_SERVER_ERROR or
  // STATUS_NOT_FOUND; in these cases, we have custom error messages that
  // help the student out (see switch statement below).
  if (expected === STATUS_SERVER_ERROR || expected === STATUS_NOT_FOUND) {
    throw new Error(
      'The expected status should be something other than ' +
      `${STATUS_SERVER_ERROR} and ${STATUS_NOT_FOUND}`
    );
  }

  switch (res.status) {
    case STATUS_SERVER_ERROR:
      throw new Error(
        `Your server threw an error during ${method} ${path} (status code ` +
        '500); scroll up to see the expection and backtrace'
      );

    case STATUS_NOT_FOUND:
      throw new Error(
        `You haven't implemented a handler for ${method} ${path} (status ` +
        'code 404)'
      );

    default:
      if (expected !== res.status) {
        const msg = `Expected status ${expected} but got ${res.status} from ` +
          `${method} ${path}`;
        throw new Error(msg);
      }

      /* eslint no-unused-expressions: 0 */
      // This is the correct way to make the expectation, even though it seems odd.
      expect(res).to.be.json;
  }
};

/* Makes a request using the given method to the provided path. If body is
 * given, sends it along with the request. Checks for the expected status.
 * Pass agent if you'd like to use an existing chai agent, which will persist
 * cookies across requests. */
const req = (method, path, status, body = null, agent = null) => {
  if (!agent) {
    agent = chai.request.agent(server.server);
  }

  const property = method.toLowerCase();
  let request = agent[property](path);

  if (body) {
    request = request.send(body);
  }

  return request
    .catch((err) => {
      // For status codes like 404, 500, and 422, the promise fails and contains
      // a response property in the error object. We want to rescue these cases
      // and return the response object normally. That way we can have a single
      // handler that checks status properly in all cases.
      if (err.response) {
        return err.response;
      }
      throw err;
    })
    .then((res) => {
      expectStatus(status, method, path, res);
      return res.body;
    });
};

/* Adds a user with the given credentials by making a request. */
const addUser = (credentials) => {
  const { username, password } = credentials;
  return req(METHOD_POST, '/users', STATUS_OK, credentials).then((newUser) => {
    expect(newUser).to.have.property('username').that.equals(username);
    expect(newUser).to.not.have.property('password');

    // don't know what the hash is, but we do know it should be 60 characters
    expect(newUser).to.have.property('passwordHash').that.has.length(60);
    return newUser;
  });
};

describe('Request', () => {
  const credentials = { username: 'bob', password: 'qoeru1934p' };
  const noUsername = { password: credentials.password };
  const noPassword = { username: credentials.username };
  const emptyPassword = { username: credentials.username, password: '' };
  const wrongUsername = { username: 'jill', password: credentials.password };
  const wrongPassword = { username: credentials.username, password: 'jlqer' };

  beforeEach(() => User.remove({}));

  describe(`${METHOD_POST} ${USERS_PATH}`, () => {
    it('adds a user', () => addUser(credentials));

    it('reports a missing username', () => {
      return req(METHOD_POST, USERS_PATH, STATUS_USER_ERROR, noUsername);
    });

    it('reports a missing password', () => {
      return req(METHOD_POST, USERS_PATH, STATUS_USER_ERROR, noPassword);
    });

    // An empty password can still be hashed by bcrypt. Make sure the server
    // is explicitly responding with an error in this case.
    it('reports an empty password', () => {
      return req(METHOD_POST, USERS_PATH, STATUS_USER_ERROR, emptyPassword);
    });
  });

  describe(`${METHOD_POST} ${LOG_IN_PATH}`, () => {
    beforeEach(() => addUser(credentials));

    it('logs a user in', () => {
      return req(METHOD_POST, LOG_IN_PATH, STATUS_OK, credentials)
        .then(result => expect(result).to.deep.equal({ success: true }));
    });

    it('reports a missing username', () => {
      return req(METHOD_POST, LOG_IN_PATH, STATUS_USER_ERROR, noUsername);
    });

    it('reports a missing password', () => {
      return req(METHOD_POST, LOG_IN_PATH, STATUS_USER_ERROR, noPassword);
    });

    it('reports a wrong username', () => {
      return req(METHOD_POST, LOG_IN_PATH, STATUS_USER_ERROR, wrongUsername);
    });

    it('reports a wrong password', () => {
      return req(METHOD_POST, LOG_IN_PATH, STATUS_USER_ERROR, wrongPassword);
    });
  });

  describe(`${METHOD_GET} ${ME_PATH}`, () => {
    let user;
    beforeEach(() => addUser(credentials).then(newUser => user = newUser));

    it('responds with details about the logged in user', () => {
      const agent = chai.request.agent(server.server);
      return req(METHOD_POST, LOG_IN_PATH, STATUS_OK, credentials, agent)
        .then((result) => {
          expect(result).to.deep.equal({ success: true });
          return req(METHOD_GET, ME_PATH, STATUS_OK, null, agent);
        })
        .then(me => expect(me).to.deep.equal(user));
    });

    it("reports an error when a user isn't logged in", () => {
      return req(METHOD_GET, ME_PATH, STATUS_USER_ERROR);
    });
  });
});
