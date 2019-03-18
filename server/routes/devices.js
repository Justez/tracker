var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp')
const { google } = require('googleapis');
var { checkDeviceExists, createCoordRecord } = require('../utils/driveUtils');

router.get('/:id/:coords', function(req, res, next) { //domain:8081/api/devices/:id/:coordinates * 4 ex. "54.5641231,65.986532"
    try {
        authenticate(saveCoords);
    
        async function saveCoords(auth) {
          const drive = google.drive({version: 'v3', auth});
          const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          const { id, coords } = req.params;
          if (/^-{0,1}\d{1,3}\.\d+,{1}-{0,1}\d{1,3}\.\d+$/.test(coords) && id.length >= 10) {
            const check = await checkDeviceExists(drive, id, ip)
            if (check.status === 200) {
              // if (check.ip === ip) {
                const save = await saveLocation(drive, check.id, coords);
                res.status(save.status || 400).json(save);
              // } else res.status(400).json({ message: `Forbidden from IP ${ip}.` });
              // todo send email to set new ip
            } else res.status(check.status || 400).json(check)
          } else {
            res.status(400).json({ message: 'Details not valid!' })
          }
        }
    
        function saveLocation(drive, id, coords) {
          return new Promise(resolve => {
            const today = (new Date).toLocaleDateString();
    
            drive.files.list({
              fields: 'files(id, name)', 
              q: `name contains 'tracking:${today}' and '${id}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
            },
              (trackErrors, trackResults) => {
                trackErrors && resolve({ status: trackErrors.response.status, error: trackErrors.errors[0].message });
                  if (trackResults.data.files.length) {
                    const track = trackResults.data.files[0];
                    resolve(createCoordRecord(drive, track.id, coords));
                  } else {
                    drive.files.create({
                      resource: { 'name': `tracking:${today}`, mimeType: 'application/vnd.google-apps.folder', parents: [id] },  
                      fields: 'id',
                    }, (newtrackDayError, newtrackDayResponse) => {
                      newtrackDayError && resolve({ status: 500, error: newtrackDayError.errors[0].message });
                      if (newtrackDayResponse) {
                        const id = newtrackDayResponse.data.id
                        id && resolve(createCoordRecord(drive, id, coords));
                        resolve({ status: 500, error: 'Failed to save.' });
                      } else {
                        resolve({ status: 500, error: 'Failed to save.' });
                      }
                  })
                }
              });
          });
        }
      } catch (e) {
        next(e) 
      }
});

router.post('/trackdays', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userID, name: trackerName } = req.body;
      const check = await checkUserExists(drive, userID, email)
      if (check.status === 200) {
        const trackDays = await getTrackDays(drive, trackerName, userID);
        res.status(trackDays.status || 400).json(trackDays)
      } else res.status(check.status || 400).json(check)
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
              } else resolve({ status: 400, error: 'Unexpected error. Tracker information missing. Please contact support for details.'});
            }
          });
      });
    }
  } catch (e) {
    next(e) 
  }
});

router.post('/tracks', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userID, id } = req.body;
      const check = await checkUserExists(drive, userID, email)
      if (check.status === 200) {
        const tracks = await getTracks(drive, id);
        res.status(tracks.status || 400).json(tracks)
      } else res.status(check.status || 400).json(check)
    }

    function getTracks(drive, trackDayId) {
      return new Promise(resolve => {
        drive.files.list({
          fields: 'files(id, name)', 
          q: `'${trackDayId}' in parents and name contains 'txt'` 
        }, (trackFileErrors, trackFiles) => {
          trackFileErrors && resolve({ status: trackFileErrors.response.status, error: trackFileErrors.errors })
          try {
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
          } catch (e) {
            resolve({ status: 500, error: 'Data provided was incorrect. Please check you tracker settings to respond documentation of our API.' })
          }
          resolve({ status: 204, error: 'No data.'})
        });
      });
    }
  } catch (e) {
    next(e) 
  }
});

module.exports = router;