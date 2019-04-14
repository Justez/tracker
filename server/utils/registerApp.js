
function authenticate(callbackFunction) {
    const fs = require('fs');
    const readline = require('readline');
    const { google } = require('googleapis');

    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    // const TOKEN_PATH = 'token.json';
    
    // fs.readFile('credentials.json', (err, content) => {
    //   if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(process.env.CREDENTIALS), callbackFunction);
    // });
    
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
      // fs.readFile(TOKEN_PATH, (err, token) => {
        // if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(process.env.TOKEN));
        callback(oAuth2Client);
      // });
    }
    
    // function getAccessToken(oAuth2Client, callback) {
    //   const authUrl = oAuth2Client.generateAuthUrl({
    //     access_type: 'offline',
    //     scope: SCOPES,
    //   });
    //   console.log('Authorize this app by visiting this url:', authUrl);
    //   const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //   });
    //   rl.question('Enter the code from that page here: ', (code) => {
    //     rl.close();
    //     oAuth2Client.getToken(code, (err, token) => {
    //       if (err) return console.error('Error retrieving access token', err);
    //       oAuth2Client.setCredentials(token);
    //       // Store the token to disk for later program executions
    //       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    //         if (err) console.error(err);
    //       });
    //       callback(oAuth2Client);
    //     });
    //   });
    // }
}

module.exports = authenticate