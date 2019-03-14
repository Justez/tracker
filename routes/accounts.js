var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp')
var { checkUserExists, getUserDevices } = require('../utils/driveUtils');
const { google } = require('googleapis');

router.get('/', function(req, res, next) {});

router.post('/create', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const users = await getUsers(drive);
      res.status(users.status || 500).json(users)
    }

    function getUsers(drive) {
      return new Promise(resolve => {
        const email = req.body.email;
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name = '${email}' and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (userErrors, userResults) => {
            userErrors && resolve({ status: userErrors.response.status, error: userErrors.errors });
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
                newuserError && resolve({ status: newuserError.newuserResponse.status, error: newuserError.errors[0] });
                resolve({ status: 200 });
              });
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
        res.status(devices.status || 500).json(devices)
      } else res.status(check.status || 500).json(check)
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
                resolve({ status: 500, error: deviceErrors.errors[0].message });
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

router.post('/devices/trackdays', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userID, name: trackerName } = req.body;
      const check = await checkUserExists(drive, userID, email)
      if (check.status === 200) {
        const trackDays = await getTrackDays(drive, trackerName, userID);
        res.status(trackDays.status || 500).json(trackDays)
      } else res.status(check.status || 500).json(check)
    }

    function getTrackDays(drive, trackerName, userID) {
      return new Promise(resolve => {
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name contains 'name:${trackerName} ID:' and '${userID}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (deviceListErrors, deviceListResults) => {
            if (deviceListErrors) {
              resolve({ status: deviceListErrors.response.status, error: deviceListErrors.errors });
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

router.post('/devices/tracks', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userID, id } = req.body;
      const check = await checkUserExists(drive, userID, email)
      if (check.status === 200) {
        const tracks = await getTracks(drive, id);
        res.status(tracks.status || 500).json(tracks)
      } else res.status(check.status || 500).json(check)
    }

    function getTracks(drive, trackDayId) {
      return new Promise(resolve => {
        drive.files.list({
          fields: 'files(id, name)', 
          q: `'${trackDayId}' in parents and name contains 'txt'` 
        }, (trackFileErrors, trackFiles) => {
          trackFileErrors && resolve({ status: trackFileErrors.response.status, error: trackFileErrors.errors })
          trackFiles.data.files.length && resolve({
            status: 200, 
            tracks: trackFiles.data.files.map(f => {
              const coords = (f.name.split('|')[1]).split('.txt')[0];
              return ({ 
                id: f.id, 
                date: f.name.split('|')[0], 
                coords: { lat: coords.split(',')[0], lng: coords.split(',')[1] }
              })
            }) 
          })
          resolve({ status: 204, error: 'No data.'})
        });
      });
    }
  } catch (e) {
    next(e) 
  }
});

module.exports = router;
