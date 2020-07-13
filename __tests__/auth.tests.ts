import * as request from 'supertest';

import App from '../src/app';
import { DBConnect } from '../src/config/database';
let emailGen = "test" + Math.random() + "@gmail.com"

describe('API Test User Registration', () => {
    let connection;

    beforeAll(async () => {
        connection = await DBConnect();
    });

    afterAll(async () => {
        await connection.close();
    });
    it('should ensure that user registeration endpoint works', (done) => {
        return request(App)
            .post('/api/register')
            .set("Content-Type", "application/json")
            .send({ firstName: "John", lastName: "Doe", email: emailGen, password: "12345" })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('token')
                expect(res.body).toHaveProperty('message', "User successfully Registered")
                expect(res.body).toHaveProperty('user')
                done();
            }).catch(done)
    })

});


describe('API Test User Login', () => {
    let connection;

    beforeAll(async () => {
        connection = await DBConnect();
    });

    afterAll(async () => {
        await connection.close();
    });
    it('should ensure that the login endpoint works', (done) => {
        return request(App)
            .post('/api/login')
            .set("Content-Type", "application/json")
            .send({ email: emailGen, password: "12345" })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('token')
                expect(res.body).toHaveProperty('message', "User authentication successful")
                expect(res.body).toHaveProperty('user')
                done();
            }).catch(done)
    })

});