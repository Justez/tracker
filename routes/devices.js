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

module.exports = router;