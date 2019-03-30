const request = require('supertest');
const app = require('../app');
const createUser = require('./utils/createUser');
const clearUser = require('./utils/clearUser');
const { sessionsBaseUrl } = require('./utils/routes');
const email = `test${Math.random()}@test.test`;

beforeAll(() => createUser(email));
afterAll(() => clearUser(email));

describe('Test sessions start path', () => {
    test('New path with no params returns error', (done) => {
        request(app).post(sessionsBaseUrl + '/new')
        .then(response => {
            expect(response.status).toBe(400); 
            done();
        });
    });

    test('New path with non existent email returns error', (done) => {
        request(app).post(sessionsBaseUrl + '/new')
        .send({ email: 'notagoodemail'})
        .then(response => {
            expect(response.status).toBe(401); 
            expect(response.body.warning).toBe('Please register to use our services!');
            done();
        });
    });

    test('New path with email returns response', (done) => {
        request(app).post(sessionsBaseUrl + '/new')
        .send({ email })
        .then((response) => {
            expect(response.status).toBe(200);
            done();
        });
    });

    // test('Create path with same email returns error', (done) => {
    //     request(app).post(sessionsBaseUrl + '/new')
    //     .send({ email })
    //     .then((response) => {
    //         expect(response.status).toBe(300);
    //         expect(response.body.error).toBe('Email is already taken!');
    //         done();
    //     })
    // });
});

describe('Test sessions start path', () => {
});

