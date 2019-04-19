import express = require('express');
import { credentialsConfig } from '../../config';
import { GmailService } from '../../services/gmailService';
import { GoogleApis } from 'googleapis';
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { loggers } from 'winston';

const logger = loggers.get('logger');
const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
	logger.info('Start: GoogleOAuthService().checkGapiAuth()');
	new GoogleOAuthService(credentialsConfig.google, logger).checkOAuth(req, res, next);
});

router.get('/unreadThreads', (req, res) => {
	new GmailService(new GoogleApis()).getUnreadEmailThreads(res.locals.authResp)
		.then((apiResp) => res.apiResponse(apiResp))
		.catch((apiErr) => res.apiError(apiErr));
});

router.put('/readThread/:id', (req, res) => {
	new GmailService(new GoogleApis()).updateEmailThreadAsRead(res.locals.authResp, req.params.id)
		.then((apiResp) => res.apiResponse(apiResp))
		.catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
