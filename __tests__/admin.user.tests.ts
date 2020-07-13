import * as request from 'supertest';
import App from '../src/app';
import { DBConnect } from '../src/config/database';

describe('Admin Get All Users', () => {
  let connection;

  beforeAll(async () => {
    connection = await DBConnect();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('ensure that the admin can retrive all users in the system', done => {
    request(App)
      .get('/api/admin/getAllUsers')
      .set('Content-Type', 'application/json')
      .accept('Content-Type', 'application/json')
      .send()
      .then(res => {
        expect(res.status).toBe(200)
        done();
      }).catch(done)
  })
})