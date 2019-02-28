var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp')
const { google } = require('googleapis');
var { checkDeviceExists } = require('../utils/driveUtils');

router.get('/:id/:coords', function(req, res, next) {
    try {
        authenticate(saveCoords);
    
        async function saveCoords(auth) {
            const drive = google.drive({version: 'v3', auth});
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const { id, coords } = req.params;
            const check = await checkDeviceExists(drive, id)
            if (check.status === 200) {
                // if (check.ip === ip) {
                    const save = await saveLocation(drive, check.id, coords);
                    res.json(save);
                // } else res.json({ status: 404, message: 'forbidden' });
                // todo send email to set new ip
            } else res.json(check)
        }
    
        function saveLocation(drive, id, coords) {
          return new Promise(resolve => {
            const today = (new Date).toLocaleDateString();
            const now = (new Date()).toISOString();
    
            drive.files.list({
              fields: 'files(id, name)', 
              q: `name contains 'tracking:${today}' and '${id}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
            },
              (trackErrors, trackResults) => {
                if (trackErrors) {
                  resolve({ status: trackErrors.response.status, error: trackErrors.errors[0].message });
                } else {
                    if (trackResults.data.files.length) {
                        const track = trackResults.data.files[0];
                        drive.files.create({
                            resource: { 'name': `${now}|${coords}.txt`, parents: [track.id] },  
                            fields: 'id',
                        }, (newtrackError, newtrackResponse) => {
                            if (newtrackError) {
                            resolve({ status: newtrackError.newtrackResponse.status, error: newtrackError.errors[0].message });
                            } else {
                            resolve({ status: newtrackResponse.data.id ? 200 : 500 });
                            }
                        })
                    } else {
                        drive.files.create({
                            resource: { 'name': `tracking:${today}`, mimeType: 'application/vnd.google-apps.folder', parents: [id] },  
                            fields: 'id',
                        }, (newtrackDayError, newtrackDayResponse) => {
                            if (newtrackDayError) {
                                resolve({ status: 500, error: newtrackDayError.errors[0].message });
                            } else {
                                if (newtrackDayResponse.data.id) {
                                    drive.files.create({
                                        resource: { 'name': `${now}|${coords}.txt`, parents: [newtrackDayResponse.data.id] },  
                                        fields: 'id',
                                    }, (newtrackError, newtrackResponse) => {
                                        if (newtrackError) {
                                            resolve({ status: newtrackError.newtrackResponse.status, error: newtrackError.errors[0] });
                                        } else {
                                            resolve({ status: newtrackResponse.data.id ? 200 : 500 });
                                        }
                                    })
                                } else {
                                    resolve({ status: 500, error: 'Failed to save.' });
                                }
                            }
                      })
                  }
                }
              });
          });
        }
      } catch (e) {
        next(e) 
      }
});

module.exports = router;