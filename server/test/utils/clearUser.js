const request = require('supertest');
const app = require('../../app');
const { accountsBaseUrl } = require('./routes');

function clearUser(email) {
    request(app).delete(accountsBaseUrl + '/remove')
        .send({ email })
        .then(response => response.status != 200 && console.log('User Cleanup:', response.status))
        .catch(err => console.log('User Cleanup error:', err.status, err.body))
}

module.exports = clearUser;