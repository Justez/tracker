var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp');

router.post('/new', function(req, res, next) {
  try {
    authenticate(findUser);

    async function findUser(auth) {
      const email = req.body.email;
      const search = await findFileWithEmail(auth, email);
      res.json(search)
      return search;
    }

    function findFileWithEmail(auth, email) {
      return new Promise(resolve => {
        const { google } = require('googleapis');
        const drive = google.drive({version: 'v3', auth});

        drive.files.list({ fields: 'files(id, name)', q: `name contains '${email}' and mimeType = 'application/vnd.google-apps.folder'` }, 
        (err, res) => {
          if (err) {
            resolve({ status: err.response.status, error: err.errors, url: err.config.url });
          } else {
            if (res.data.files.length) {
              const file = res.data.files[0];
              const data = { status: 200, email };
              const today = (new Date).toLocaleDateString();

              drive.files.list({ 
                fields: 'files(id, name)', 
                q: `name contains 'session' and name contains '${today}' and '${file.id}' in parents` 
              },
                (errors, results) => {
                  if (errors) {
                    resolve({ status: errors.response.status, error: errors.errors, url: errors.config.url });
                  } else {
                    if (results.data.files.length) {
                      const meta = results.data.files[0];
                      resolve({ ...data, expiry: today, id: meta.id });
                    } else {
                      drive.files.create({ 
                        resource: { 'name': `session ${today}.txt`, parents: [file.id] },  
                        folderId : file.id,
                        fields: 'id',
                      }, (err, response) => {
                          if (err) {
                            resolve({ status: err.response.status, error: err.errors[0], url: err.config.url });
                          }
                          resolve({ ...data, expiry: today, id: response.data.id });
                        })
                    }
                  }
                });
              } 
              resolve({ status: 404, email, warning: "Please register to use our services. Redirecting..." });
          }
        });
      });
    }
  } catch (e) {
    next(e) 
  }
});

module.exports = router;
  