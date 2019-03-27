import express = require('express');
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { GoogleAuth } from 'google-auth-library';
import config = require('../../config');

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => {
    next();
});
  
router.get('/getUserOAuth2Url', (req, res) => {
    var authorizationUrl = new GoogleOAuthService(new GoogleAuth(), config.credentialsConfig.google).getUserAuth2Url();
    res.json({ url: authorizationUrl });
});

router.get('/getTokenFromCode', (req, res) => {
    if (req.query.code) {
        var code = req.query.code;
        new GoogleOAuthService(new GoogleAuth(), config.credentialsConfig.google).getTokenFromCode(code).then((codeResp) => {
            res.redirect(`${config.webConfig.clientHostname}/googleAuth?uid=${codeResp}`);
        }).catch((err) => {
            res.redirect(`${config.webConfig.clientHostname}/error?err=${err}`);
        });
    } else {
        res.redirect(`${config.webConfig.clientHostname}/error?err="Code" query param is required`);
    }
});

module.exports = router;