import express = require('express');
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { GoogleAuth } from 'google-auth-library';
import config = require('../../config');
import { GmailService } from '../../services/gmailService';
import { GoogleApis } from 'googleapis';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => {
    var tokenUserAuthUID = req.cookies['googleAuthUID'];

    if (tokenUserAuthUID != undefined && !Array.isArray(tokenUserAuthUID)) {
        new GoogleOAuthService(new GoogleAuth(), config.oauthConfig.google).checkForUsersToken(tokenUserAuthUID).then((authResp) => {
            res.locals.authResp = authResp
            next(); 
        }).catch((authErr) => res.apiError(authErr));
    } else {
        res.apiError("Error: UserAuthUID missing or malformed.")
    }
});

router.get('/getUnreadEmails', (req, res) => {
    new GmailService(new GoogleApis()).getUnreadEmails(res.locals.authResp)
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
