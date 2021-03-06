import * as request from 'supertest';
import App from '../src/app';
import { DBConnect } from '../src/config/database';

describe('Admin Get Customer Tickets', () => {
  let connection;

  beforeAll(async () => {
    connection = await DBConnect();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('ensure that the admin can retrive all tickets in the system', done => {
    request(App)
      .get('/api/admin/getAllTickets')
      .set('Content-Type', 'application/json')
      .accept('Content-Type', 'application/json')
      .send()
      .then(res => {
        expect(res.status).toBe(200)
        done();
      }).catch(done)
  })
})