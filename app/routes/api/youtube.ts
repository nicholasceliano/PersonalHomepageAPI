import express = require('express');
import { credentialsConfig } from '../../config';
import { GoogleApis } from 'googleapis';
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { YoutubeService } from '../../services/youtubeService';
import { loggers } from 'winston';

const logger = loggers.get('logger');
const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
	logger.info('Start: GoogleOAuthService().checkGapiAuth()');
	new GoogleOAuthService(credentialsConfig.google, logger).checkOAuth(req, res, next);
});

router.get('/subscription', (req, res) => {
	new YoutubeService(new GoogleApis()).getSubscriptionVidoes(res.locals.authResp)
		.then((apiResp) => res.apiResponse(apiResp))
		.catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
