const request = require('supertest');

const server = require('../api/server.js');

const db = require('../database/dbConfig.js');

let token = '';
let falseToken = '7*&TGHJVufvubyvtfu.8575tGyfiujOBIbIYFu683atsi';

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
        });

      const users = await db('users');
      expect(users.length).toBe(1);
      expect(res.status).toBe(201);
    });
    // it('should throw 412 error if required input absent', async () => {
    //   const res = await request(server)
    //     .post('/api/register')
    //     .send({
    //       username: 'siratl',
    //       password: '1234',
    //       fullName: 'Elisha Atulomah',
    //     });

    //   expect(res.status).toBe(412);
    // });
  });

  describe('Login Endpoint', () => {
    it('should return status 200 and provide token', async () => {
      const res = await request(server)
        .post('/api/login')
        .send({ username: 'siratl', password: '1234' });
      token = res.body.token;
      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    });
  });

  describe('GET User Endpoint', () => {
    it('should return a user when authenticated', async () => {
      const res = await request(server)
        .get('/api/users/1')
        .set('authorization', token);
      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([]));
    });
  });

  describe('PUT Update User Endpoint', () => {
    it('should update user account upon authorization with status code 200 OK', async () => {
      const res = await request(server)
        .put('/api/users/1')
        .set('authorization', token)
        .send({ username: 'samuel', password: '4321' });
      expect(res.status).toBe(200);
    });
  });

  describe('PUT Create Habit Endpoint', () => {
    it('should create a habit in an array and return a status 201 OK', async () => {
      const res = await request(server)
        .post('/api/habits')
        .set('authorization', token)
        .send({ habitTitle: 'Work out', categoryId: 1 });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.arrayContaining([]));
    });
  });

  // describe('PUT Create Category Endpoint', () => {
  //   it('should create a category and return an array with a status 201 OK', async () => {
  //     const res = await request(server)
  //       .post('/api/categories')
  //       .set('authorization', token)
  //       .send({ categoryTitle: 'Physical Training', color: 1 });
  //     expect(res.status).toBe(201);
  //     expect(res.body).toEqual(expect.arrayContaining([]));
  //   });
  // });

  describe('GET Habit endpoint', () => {
    afterEach(async () => {
      await db('users').truncate();
    });
    it('should get the habits of logged in user and return status 200 OK', async () => {
      const res = await request(server)
        .get('/api/habits')
        .set('authorization', token);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([]));
    });
  });
});
