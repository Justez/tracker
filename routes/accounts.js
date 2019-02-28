var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp')
var { checkUserExists, getUserDevices } = require('../utils/driveUtils');
const { google } = require('googleapis');

router.get('/', function(req, res, next) {
});

router.post('/create', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const users = await getUsers(drive);
      res.json(users)
    }

    function getUsers(drive) {
      return new Promise(resolve => {
        const email = req.body.email;
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name = '${email}' and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (userErrors, userResults) => {
            if (userErrors) {
              resolve({ status: userErrors.response.status, error: userErrors.errors, url: userErrors.config.url });
            } else {
              if (userResults.data.files.length) {
                resolve({ status: 300, error: 'Email is already taken!' });
              } else {
                drive.files.create({
                  resource: {
                    'name': email,
                    'mimeType': 'application/vnd.google-apps.folder'
                  },
                  fields: 'id'
                }, (newuserError) => {
                      if (newuserError) {
                        resolve({ status: newuserError.newuserResponse.status, error: newuserError.errors[0], url: newuserError.config.url });
                      } else resolve({ status: 200 });
                });
              }
            }
          })
      });
    }
  } catch (e) {
    next(e) 
  }
});

router.post('/devices/new', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userId } = req.body;
      const check = await checkUserExists(drive, userId, email)
      if (check.status === 200) {
        const devices = await getDevices(drive, check.id, email);
        res.json(devices)
      } else res.json(check)
    }

    function getDevices(drive, userId) {
      return new Promise(resolve => {
        const ID = req.body.device.trackerID;
        const IP = req.body.device.trackerIP;
        const name = req.body.device.trackerName;
        drive.files.create({
          resource: {
            'name': `name:${name} ID:${ID} IP:${IP}`,
            parents: [userId],
            'mimeType': 'application/vnd.google-apps.folder'
          },
          fields: 'id'
        }, (deviceErrors) => {
              if (deviceErrors) {
                resolve({ status: 500, error: deviceErrors.errors[0].message, url: deviceErrors.config.url });
              } else getUserDevices(drive, userId).then(info => resolve(info));
        });
      });
    }
  } catch (e) {
    next(e) 
  }
});

router.post('/devices/all', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const { email, id } = req.body;
      const drive = google.drive({version: 'v3', auth});
      const check = await checkUserExists(drive, id, email)
      if (check.status === 200) {
        const devices = await new Promise(resolve => {
          getUserDevices(drive, id).then(info => resolve(info));
        });
        res.json(devices)
      } else res.json(check)
    }
  } catch (e) {
    next(e) 
  }
});

router.post('/devices/tracks', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userID, name: trackerName } = req.body;
      const check = await checkUserExists(drive, userID, email)
      if (check.status === 200) {
        const devices = await getTracks(drive, trackerName, userID);
        res.json(devices)
      } else res.json(check)
    }

    function getTracks(drive, trackerName, userID) {
      return new Promise(resolve => {
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name contains 'name:${trackerName} ID:' and '${userID}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (deviceListErrors, deviceListResults) => {
            if (deviceListErrors) {
              resolve({ status: deviceListErrors.response.status, error: deviceListErrors.errors, url: deviceListErrors.config.url });
            } else {
              if (deviceListResults.data.files.length) {
                drive.files.list({
                  fields: 'files(id, name)', 
                  q: `'${deviceListResults.data.files[0].id}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
                }, (trackErr, trackRes) => {
                  if (trackErr) resolve({ status: trackErr.response.status, error: trackErr.errors })
                  if (!trackErr) {
                    if (trackRes.data.files.length) {
                      resolve({ status: 200, trackDays: trackRes.data.files.map(f => ({ id: f.id, name: f.name.split(':')[1] })) })
                    } else {
                      resolve({ status: 204, error: 'No data recorded yet.'})
                    }
                  }
                });
              } else resolve({ status: 500, error: 'Unexpected error. Tracker information missing. Please contact support for details.'});
            }
          });
      });
    }
  } catch (e) {
    next(e) 
  }
});


module.exports = router;
