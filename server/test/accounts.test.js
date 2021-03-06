const request = require('supertest');
const app = require('../app');
const clearUser = require('./utils/clearUser');
const { accountsBaseUrl } = require('./utils/routes');
const email = `test${Math.random()}@test.test`;

afterAll(() => clearUser(email));

describe('Test accounts create path', () => {
    test('Create path with no params returns error', (done) => {
        request(app).post(accountsBaseUrl + '/create')
        .then(response => {
            expect(response.status).toBe(400); 
            done();
        });
    });

    test('Create path with email returns response', (done) => {
        request(app).post(accountsBaseUrl + '/create')
        .send({ email })
        .then((response) => { 
            expect(response.status).toBe(200);
            done();
        });
    });

    test('Create path with same email returns error', (done) => {
        request(app).post(accountsBaseUrl + '/create')
        .send({ email })
        .then((response) => {
            expect(response.status).toBe(300);
            expect(response.body.error).toBe('Email is already taken!');
            done();
        })
    });
});

describe('Test devices new path', () => {
    test('Add device path with no params returns warning', (done) => {
        request(app).post(accountsBaseUrl + '/devices/new')
        .then((response) => {
            expect(response.status).toBe(400);
            done();
        });
    });

    test('Add device path with user params only returns error', (done) => {
        request(app).post(accountsBaseUrl + '/devices/new')
        .send({ email })
        .then((response) => {
            expect(response.status).toBe(400);
            done();
        });
    });

    test('Add device path with empty device params returns error', (done) => {
        request(app).post(accountsBaseUrl + '/devices/new')
        .send({ email, device: {} })
        .then((response) => {
            expect(response.status).toBe(400);
            done();
        });
    });

    test('Add device path with incorrect device params returns error', (done) => {
        request(app).post(accountsBaseUrl + '/devices/new')
        .send({ email, device: { ID: 'jbkasd645a1s3dajbkas', IP: '::1', name: 'devicename123' }})
        .then((response) => {
            expect(response.status).toBe(400);
            done();
        });
    });

    test('Add device path with device params returns device list', (done) => {
        request(app).post(accountsBaseUrl + '/devices/new')
        .send({ email, device: { trackerID: '1s3dajbkas10', trackerIP: '39984232', trackerName: 'devicename123' }})
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body.devices.length).toBeGreaterThan(0);
            done();
        });
    });

    test('Add device path with device params returns already registered error', (done) => {
        request(app).post(accountsBaseUrl + '/devices/new')
        .send({ email, device: { trackerID: '1s3dajbkas10', trackerIP: '39984232', trackerName: 'devicename123' }})
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Device is already registered!');
            done();
        });
    });
});

