const request = require('supertest');
const app = require('../../app');
const { accountsBaseUrl } = require('./routes');

async function createUser(email) {
    await request(app).post(accountsBaseUrl + '/create')
        .send({ email })
        .then(response => response.status != 200 && console.log('User Create:', response.status))
        .catch(err => console.log('User Create error:', err.status, err.body))
}

module.exports = createUser;