var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp')
var { checkUserExists, getUserDevices } = require('../utils/driveUtils');
const { google } = require('googleapis');

router.post('/create', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email } = req.body;
      if (email) {
        const users = await getUsers(drive, email);
        res.status(users.status || 400).json(users);
      } else res.sendStatus(400);
    }

    function getUsers(drive, email) {
      return new Promise(resolve => {
        drive.files.list({
            fields: 'files(id, name)', 
            q: `name = '${email}' and mimeType = 'application/vnd.google-apps.folder'` 
          },
          (userErrors, userResults) => {
            userErrors 
              && resolve({ status: userErrors.response.status, error: userErrors.errors });
            userResults.data.files.length 
              && resolve({ status: 300, error: 'Email is already taken!' });
            drive.files.create({
              resource: {
                'name': email,
                'mimeType': 'application/vnd.google-apps.folder'
              },
              fields: 'id'
            }, (newuserError) => {
              newuserError && resolve({ status: newuserError.response.status, error: newuserError.errors[0] });
              resolve({ status: 200 });
            });
          });
      });
    }
  } catch (e) {
    next(e);
  }
});

router.delete('/remove', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email } = req.body;
      const users = await deleteUser(drive, email);
      res.status(users.status || 400).json(users);
    }

    function deleteUser(drive, email) {
      return new Promise(resolve => {
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name = '${email}' and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (userErrors, userResults) => {
            userErrors && resolve({ status: userErrors.response.status, error: userErrors.errors });
            if (userResults.data.files.length) {
              drive.files.delete({
                'fileId': userResults.data.files[0].id
              }, (err) => resolve({ status: err && err.status || 200 }));
            } else {
              resolve({ status: 400 });
            }
          });
      });
    }
  } catch (e) {
    next(e);
  }
});

router.post('/devices/new', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userId, device = {} } = req.body;
      const name = `name:${device.trackerName || ''} ID:${device.trackerID || ''} IP:${device.trackerIP || ''}`;
      let userCheck;
      
      if (RegExp('(name:).{1,40}(ID:).{10,20}(IP:).{3,39}').test(name)) {
        userCheck = await checkUserExists(drive, userId, email);
        if (userCheck.status === 200) {
          const devices = await getDevices(drive, userCheck.id, device);
          res.status(devices.status || 400).json(devices);
          return;
      }};
      res.status(userCheck && userCheck.status || 400).json(userCheck || {});
    }

    async function getDevices(drive, userId, device) {
      const { trackerID, trackerIP, trackerName } = device;
      let exists;

      await getUserDevices(drive, userId).then(info => {
        if (info.status === 200) {
          exists = info.devices.find(d => d.name == trackerName && d.uniqueId == trackerID)
        }
      });

      return new Promise(resolve => {
        if (!exists) {
          drive.files.create({
            resource: {
              'name': `name:${trackerName} ID:${trackerID} IP:${trackerIP}`,
              parents: [userId],
              'mimeType': 'application/vnd.google-apps.folder'
            },
            fields: 'id'
          }, (deviceErrors) => {
            deviceErrors && resolve({ status: 400, error: deviceErrors.errors[0].message });
            getUserDevices(drive, userId).then(info => resolve(info));
          });
        } else resolve({ status: 400, error: 'Device is already registered!' });
      });
    }
  } catch (e) {
    next(e);
  };
});

router.post('/devices/all', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const { email, id } = req.body;
      const drive = google.drive({version: 'v3', auth});
      const check = await checkUserExists(drive, id, email)
      if (check.status === 200) {
        const devices = await new Promise(resolve => 
          getUserDevices(drive, id).then(info => resolve(info)));
        res.json(devices)
      } else res.status(check.status).json(check)
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
