var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp')

router.get('/', function(req, res, next) {
});

router.get('/all', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const email = req.body.email;
      const users = await getUsers(auth);
      res.json(users)
      return;
    }

    function getUsers(auth) {
      return new Promise(resolve => {
        const { google } = require('googleapis');
        const drive = google.drive({version: 'v3', auth});
        drive.files.list({
          pageSize: 10,
          fields: 'nextPageToken, files(name)',
          q: `mimeType = 'application/vnd.google-apps.folder'`
        }, (err, res) => {
          if (err) {
            resolve('error: ' + JSON.parse(err));
            return;
          }
          const files = res.data.files;
          if (files.length) {
            resolve(files.map((file) => file.name))
          } else
            resolve('no files found')
        });
      });
    }
  } catch (e) {
    next(e) 
  }
});

router.post('/create', function(req, res, next) {
  try {
    authenticate(users);

    async function users(auth) {
      const users = await getUsers(auth);
      res.json(users)
      return;
    }

    function getUsers(auth) {
      return new Promise(resolve => {
        const email = req.body.email;
        const { google } = require('googleapis');
        const drive = google.drive({version: 'v3', auth});
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name = '${email}' and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (userErrors, userResults) => {
            if (userErrors) {
              resolve({ status: userErrors.response.status, error: userErrors.errors, url: userErrors.config.url });
            } else {
              if (userResults.data.files.length) {
                const user = userResults.data.files[0];
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
            return;
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
      const devices = await getUsers(auth);
      res.json(devices)
      return;
    }

    function getUsers(auth) {
      return new Promise(resolve => {
        const useremail = req.body.email;
        const { google } = require('googleapis');
        const drive = google.drive({version: 'v3', auth});
        
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name = '${useremail}' and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (deviceErrors, deviceResults) => {
            if (deviceErrors) {
              resolve({ status: deviceErrors.response.status, error: deviceErrors.errors });
            } else {
              if (deviceResults.data.files.length) {
                const ID = req.body.device.trackerID;
                const IP = req.body.device.trackerIP;
                const userId = deviceResults.data.files[0].id;
                drive.files.create({
                  resource: {
                    'name': `${ID} ${IP}`,
                    parents: [userId],
                    'mimeType': 'application/vnd.google-apps.folder'
                  },
                  fields: 'id'
                }, (deviceErrors) => {
                      if (deviceErrors) {
                        resolve({ status: 500, error: deviceErrors.errors[0].message, url: deviceErrors.config.url });
                      } else {
                        drive.files.list({
                          fields: 'files(id, name)', 
                          q: `'${userId}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
                        },
                          (deviceListErrors, deviceListResults) => {
                            if (deviceListErrors) {
                              resolve({ status: deviceListErrors.response.status, error: deviceListErrors.errors, url: deviceListErrors.config.url });
                            } else {
                              if (deviceListResults.data.files.length) {
                                resolve({ status: 200, devices: deviceListResults.data.files });
                              } else resolve({ status: 500, error: 'Unexpected error. Please try again later.'})
                            }
                          });
                      }
                });
              } else resolve({ status: 404, error: 'User does not exists!' });
            }
            return;
          })
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
      const devices = await getUsers(auth);
      res.json(devices)
      return;
    }

    function getUsers(auth) {
      return new Promise(resolve => {
        const useremail = req.body.email;
        const { google } = require('googleapis');
        const drive = google.drive({version: 'v3', auth});
        
        drive.files.list({
          fields: 'files(id, name)', 
          q: `name = '${useremail}' and mimeType = 'application/vnd.google-apps.folder'` 
        },
          (deviceErrors, deviceResults) => {
            if (deviceErrors) {
              resolve({ status: deviceErrors.response.status, error: deviceErrors.errors });
            } else {
              if (deviceResults.data.files.length) {
                const userId = deviceResults.data.files[0].id;
                drive.files.list({
                  fields: 'files(id, name)', 
                  q: `'${userId}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
                },
                  (deviceListErrors, deviceListResults) => {
                    if (deviceListErrors) {
                      resolve({ status: deviceListErrors.response.status, error: deviceListErrors.errors, url: deviceListErrors.config.url });
                    } else {
                      if (deviceListResults.data.files.length) {
                        resolve({ status: 200, devices: deviceListResults.data.files });
                      } else resolve({ status: 500, error: 'Unexpected error. Please try again later.'})
                    }
                  });
              } else resolve({ status: 404, error: 'User does not exists!' });
            }
            return;
          })
      });
    }
  } catch (e) {
    next(e) 
  }
});


module.exports = router;
