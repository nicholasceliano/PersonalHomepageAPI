
import express = require('express');
import { GoogleOAuthService } from '../../oauth/googleOAuthService';
import { GoogleAuth } from 'google-auth-library';
import config = require('../../config');

const router = express.Router();

//middleware
router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

//need to check if there's an active token, if not return the URL
  
router.get('/getUserOAuth2Url', (req, res) => {
    var authorizationUrl = new GoogleOAuthService(new GoogleAuth(), config.oauthConfig.google).getUserAuth2Url();
    res.json({ url: authorizationUrl });
});

router.get('/getTokenFromCode', (req, res) => {
    var code = req.query.code;
    new GoogleOAuthService(new GoogleAuth(), config.oauthConfig.google).getTokenFromCode(code);
    res.redirect(config.webConfig.clientHostname); 
});

// router.get('/getContacts', (req, res) => {
//     var contacts = new GoogleOAuthService().authorize(getContacts);
//     console.log(contacts.length);
//     res.json(contacts);
// });

module.exports = router;