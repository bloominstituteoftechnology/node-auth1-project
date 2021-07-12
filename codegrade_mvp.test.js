const request = require('supertest')
const server = require('./api/server')
const db = require('./data/db-config')
const setCookie = require('set-cookie-parser')
const bcrypt = require('bcryptjs')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

it('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  describe('[POST] /api/auth/login', () => {
    it('[1] responds with the correct message on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      expect(res.body.message).toMatch(/welcome bob/i)
    }, 500)
    it('[2] a "chocolatechip" cookie gets set on the client on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      const cookies = setCookie.parse(res, { map: true })
      expect(cookies.chocolatechip).toMatchObject({ name: 'chocolatechip' })
    }, 500)
    it('[3] no cookie gets set on invalid credentials (saveUninitialized=false)', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: 'lady gaga' })
      const cookies = setCookie.parse(res, { map: true })
      expect(cookies).toEqual({}) // no SET-COOKIE
    }, 500)
    it('[4] responds with the correct message on invalid credentials', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '12345' })
      expect(res.body.message).toMatch(/invalid credentials/i)
    }, 500)
  })
  describe('[POST] /api/auth/register', () => {
    it('[5] creates a new user in the database', async () => {
      await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      const sue = await db('users').where('username', 'sue').first()
      expect(sue).toMatchObject({ username: 'sue' })
    }, 500)
    it('[6] new user passwords are saved correctly bcrypted', async () => {
      await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      const sue = await db('users').where('username', 'sue').first()
      expect(bcrypt.compareSync('1234', sue.password)).toBeTruthy()
    }, 500)
    it('[7] no cookie gets set by registering (saveUninitialized=false)', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      const cookies = setCookie.parse(res, { map: true })
      expect(cookies).toEqual({}) // no SET-COOKIE
    }, 500)
    it('[8] responds with the user (user_id and username)', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      expect(res.body).toMatchObject({ user_id: 2, username: 'sue' })
    }, 500)
    it('[9] responds with the proper status code and message on "username taken"', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'bob', password: '1234' })
      expect(res.status).toBe(422)
      expect(res.body.message).toMatch(/username taken/i)
    }, 500)
    it('[10] responds with the proper status code and message on too short a password', async () => {
      let res = await request(server).post('/api/auth/register').send({ username: 'sue' })
      expect(res.status).toBe(422)
      expect(res.body.message).toMatch(/ must be longer than 3/i)
      res = await request(server).post('/api/auth/register').send({ username: 'sue', password: '1' })
      expect(res.status).toBe(422)
      expect(res.body.message).toMatch(/ must be longer than 3/i)
    }, 500)
  })
  describe('[GET] /api/auth/logout', () => {
    it('[11] if there is a session it is destroyed so "chocolatechip" cookie not effective anymore', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      const { chocolatechip } = setCookie.parse(res, { map: true })
      res = await request(server).get('/api/auth/logout')
        .set('Cookie', `${chocolatechip.name}=${chocolatechip.value}`)
      expect(res.body.message).toMatch(/logged out/i)
      res = await request(server).get('/api/users')
        .set('Cookie', `${chocolatechip.name}=${chocolatechip.value}`)
      expect(res.body.message).toMatch(/you shall not pass/i)
    }, 500)
    it('[12] responds with the proper message if the user was not actually logged in', async () => {
      let res = await request(server).get('/api/auth/logout')
      expect(res.body.message).toMatch(/no session/i)
    }, 500)
  })
  describe('[GET] /api/users', () => {
    it('[13] responds with the proper status code and message on not-logged-in user', async () => {
      const res = await request(server).get('/api/users')
      expect(res.status).toBe(401)
      expect(res.body.message).toMatch(/you shall not pass/i)
    }, 500)
    it('[14] responds with the users if there is a session matching the "chocolatechip" cookie', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      const { chocolatechip } = setCookie.parse(res, { map: true })
      res = await request(server).get('/api/users')
        .set('Cookie', `${chocolatechip.name}=${chocolatechip.value}`)
      expect(res.body).toMatchObject([{ user_id: 1, username: 'bob' }])
    }, 500)
  })
})
