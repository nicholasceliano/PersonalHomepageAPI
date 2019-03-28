import express = require('express');
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { credentialsConfig } from '../../config';
import { GmailService } from '../../services/gmailService';
import { GoogleApis } from 'googleapis';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => {
    new GoogleOAuthService(credentialsConfig.google).checkGapiAuth(req, res, next);
});

router.get('/unreadEmails', (req, res) => {
    new GmailService(new GoogleApis()).getUnreadEmails(res.locals.authResp)
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
