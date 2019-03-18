var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp');
var { google } = require('googleapis');
var { checkUserExists } = require('../utils/driveUtils');

router.post('/new', function(req, res, next) {
  try {
    // console.log(req.app.get('drive'))
    authenticate(findUser);

    async function findUser(auth) {
      const drive = google.drive({version: 'v3', auth});
      const { email, userId } = req.body;
      const check = await checkUserExists(drive, userId, email)
      if (check.status === 200) {
        const search = await findFileWithEmail(drive, check.id, email);
        res.json(search)
      } else res.status(check.status || 400).json(check)
    }

    function findFileWithEmail(drive, id, email) {
      return new Promise(resolve => {
        const data = { status: 200, email };
        const today = (new Date).toLocaleDateString();

        drive.files.list({
            fields: 'files(id, name)', 
            q: `name contains 'session' and name contains '${today}' and '${id}' in parents` 
          },
          (sessionErrors, sessionResults) => {
            sessionErrors
              && resolve({ status: sessionErrors.response.status, error: sessionErrors.errors[0].message });
            sessionResults.data.files.length 
              && resolve({ ...data, expiry: today, id: sessionResults.data.files[0].id, userId: id });
            drive.files.create({
              resource: { 'name': `session ${today}.txt`, parents: [id] },  
              folderId : id,
              fields: 'id',
            }, (newSessionError, newSessionResponse) => {
              newSessionError
                && resolve({ status: newSessionError.newSessionResponse.status, error: newSessionError.errors[0] });
              resolve({ ...data, expiry: today, id: newSessionResponse.data.id, userId: id });
            })
        });
      });
    }
  } catch (e) {
    next(e) 
  }
});

module.exports = router;
  