import express = require('express');
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { GoogleAuth } from 'google-auth-library';
import config = require('../../config');
import { GmailService } from '../../services/gmailService';
import { GoogleApis } from 'googleapis';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => {
    new GoogleOAuthService(new GoogleAuth(), config.credentialsConfig.google).checkGapiAuth(req, res, next);
});

router.get('/unreadEmails', (req, res) => {
    new GmailService(new GoogleApis()).getUnreadEmails(res.locals.authResp)
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
