var express = require('express');
var router = express.Router();
var authenticate = require('../utils/registerApp')

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

        drive.files.list({ fields: 'files(id, name)', q: `mimeType contains folder/` }, 
        (err, res) => {
          if (err) {
            resolve({ status: err.response.status, error: err.errors, url: err.config.url });
          } else {
            if (res.data.files.length) {
              const file = res.data.files[0];
              // todo: parse meta data or meta file under directory (save file id)
              resolve({ status: 200, email, name: 'Guest', id: file.id });
            } else {
              resolve({ status: 404, email, message: "Please register to use our services." });
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
  