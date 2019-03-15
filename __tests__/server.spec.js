const request = require('supertest');

const server = require('../api/server.js');

const db = require('../database/dbConfig.js');
//const users = await db('users');

describe('Server Routes', () => {
  it('should set testing environment', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
    });

    it('should return instruction to access endpoints in HTML TEXT', async () => {
      const res = await request(server).get('/');
      expect(res.type).toBe('text/html');
    });
  });

  describe('Register Endpoint', () => {
    it('should insert a user into the db and return 201', async () => {
      const res = await request(server)
        .post('/api/register')
        .send({
          username: 'siratl',
          password: '1234',
          fullName: 'Elisha Atulomah',
          email: 'eli@gmail.com',
          userImgUrl: 'animage.jpg',
        });

      expect(res.status).toBe(201);
    });

    describe('Login Endpoint', () => {
      afterEach(async () => {
        await db('users').truncate();
      });
      it('should return status 200 and provide token', async () => {
        const res = await request(server)
          .post('/api/login')
          .send({ username: 'siratl', password: '1234' });
        expect(res.status).toBe(200);
      });
    });
  });
});
