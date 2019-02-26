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
        (listErrors, listResults) => {
          if (listErrors) {
            resolve({ status: listErrors.response.status, error: listErrors.errors, url: listErrors.config.url });
          } else {
            if (listResults.data.files.length) {
              const file = listResults.data.files[0];
              const data = { status: 200, email };
              const today = (new Date).toLocaleDateString();

              drive.files.list({
                fields: 'files(id, name)', 
                q: `name contains 'session' and name contains '${today}' and '${file.id}' in parents` 
              },
                (sessionErrors, sessionResults) => {
                  if (sessionErrors) {
                    resolve({ status: sessionErrors.response.status, error: sessionErrors.errors, url: sessionErrors.config.url });
                  } else {
                    if (sessionResults.data.files.length) {
                      const session = sessionResults.data.files[0];
                      resolve({ ...data, expiry: today, id: session.id });
                    } else {
                      drive.files.create({
                        resource: { 'name': `session ${today}.txt`, parents: [file.id] },  
                        folderId : file.id,
                        fields: 'id',
                      }, (newSessionError, newSessionResponse) => {
                          if (newSessionError) {
                            resolve({ status: newSessionError.newSessionResponse.status, error: newSessionError.errors[0], url: newSessionError.config.url });
                          } else
                            resolve({ ...data, expiry: today, id: newSessionResponse.data.id });
                        })
                    }
                  }
                });
              } else
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
  