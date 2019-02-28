async function getUserDevices(drive, userId) {
  return await new Promise(resolve => {
    drive.files.list({
        fields: 'files(id, name)', 
        q: `'${userId}' in parents and mimeType = 'application/vnd.google-apps.folder'` 
      },
        (deviceListErrors, deviceListResults) => {
          if (deviceListErrors) {
            resolve({ status: deviceListErrors.response.status, error: deviceListErrors.errors, url: deviceListErrors.config.url });
          } else {
            if (deviceListResults.data.files.length) {
              resolve({ status: 200, devices: deviceListResults.data.files.map(device => ({
                id: device.id,
                name: device.name.split(' ')[0].split(':')[1],
                ip: device.name.split(' ')[1].split(':')[1],
              })) });
            } else resolve({ status: 204, error: 'No devices found.'})
          }
        });
  });
}

async function checkUserExists(drive, userID, email) {
  return await new Promise(resolve => {
    drive.files.list({ fields: 'files(id, name)', q: `name contains '${email}' and mimeType = 'application/vnd.google-apps.folder'` }, 
      (err, res) => { 
        if (err) {
          resolve({ status: err.response.status, error: err.errors[0].message, url: err.config.url });
        } else {
          if (res.data.files.length && userID ? res.data.files[0].id === userID : true) {
            resolve({ status: 200, id: res.data.files[0].id })
          } else {
            resolve({ status: 404, email, warning: "Please register to use our services!" });
          }
        }
      }
    )
  })
}

async function checkDeviceExists(drive, id) {
  return await new Promise(resolve => {
    drive.files.list({ fields: 'files(id, name)', q: `name contains 'id:${id}' and mimeType = 'application/vnd.google-apps.folder'` }, 
      (err, res) => { 
        if (err) {
          resolve({ status: err.response.status, error: err.errors[0].message, url: err.config.url });
        } else {
          if (res.data.files.length) {
            const file = res.data.files[0];
            resolve({ status: 200, id: file.id, ip: file.name.split(' ')[2].split(':')[1] })
          } else {
            resolve({ status: 404, warning: "Device is not registered." });
          }
        }
      }
    )
  })
}

async function createCoordRecord(drive, parent, coords) {
  return await new Promise(resolve => {
    const now = (new Date()).toISOString();
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
  });
}

module.exports = {
  checkDeviceExists,
  createCoordRecord,
  getUserDevices,
  checkUserExists
};