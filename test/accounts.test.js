const request = require('supertest');
const app = require('../app');

const baseUrl = "/api/accounts";
const email = `test${Math.random()}@test.test`;

describe('Test accounts create path', () => {
//     test('Create path with no params returns error', (done) => {
//         request(app).post(baseUrl + '/create')
//         .catch((err) => {
//             expect(err.status).toBe(400);
//             done();
//         });
//     });

//     test('Create path with email returns response', (done) => {
//         request(app).post(baseUrl + '/create')
//         .send({ email })
//         .then((response) => { 
//             expect(response.status).toBe(200);
//             done();
//         });
//     });

//     test('Create path with same email returns error', (done) => {
//         request(app).post(baseUrl + '/create')
//         .send({ email })
//         .catch((err) => {
//             expect(err.status).toBe(300);
//             expect(err.response.body.error).toBe('Email is already taken!');
//             done();
//         })
//     });
// });

// describe('Test accounts create path', () => {
//     let devices = [];
//     test('Add device path with no params returns warning', (done) => {
//         request(app).post(baseUrl + '/devices/new')
//         .catch((err) => {
//             expect(err.status).toBe(400);
//             done();
//         });
//     });

//     test('Add device path with user params only returns error', (done) => {
//         request(app).post(baseUrl + '/devices/new')
//         .send({ email })
//         .catch((err) => {
//             expect(err.status).toBe(400);
//             done();
//         });
//     });

//     test('Add device path with empty device params returns error', (done) => {
//         request(app).post(baseUrl + '/devices/new')
//         .send({ email, device: {} })
//         .catch((err) => {
//             expect(err.status).toBe(400);
//             done();
//         });
//     });

//     test('Add device path with incorrect device params returns error', (done) => {
//         request(app).post(baseUrl + '/devices/new')
//         .send({ email, device: { ID: 'jbkasd645a1s3dajbkas', IP: '::1', name: 'devicename123' }})
//         .catch((err) => {
//             expect(err.status).toBe(400);
//             done();
//         });
//     });

//     test('Add device path with device params returns device list', (done) => {
//         request(app).post(baseUrl + '/devices/new')
//         .send({ email, device: { trackerID: 'jbkasd645a1s3dajbkas', trackerIP: '399842', trackerName: 'devicename123' }})
//         .then((response) => {
//             devices = response.body.devices;
//             expect(response.status).toBe(200);
//             expect(response.body.devices.length).toBeGreaterThan(0);
//             done();
//         });
//     });

//     test('Add device path with device params returns already registered error', (done) => {
//         request(app).post(baseUrl + '/devices/new')
//         .send({ email, device: { trackerID: 'jbkasd645a1s3dajbkas', trackerIP: '399842', trackerName: 'devicename123' }})
//         .catch((err) => {
//             expect(err.status).toBe(400);
//             expect(err.response.body.error).toBe('Device is already registered!');
//             done();
//         });
//     });
});

