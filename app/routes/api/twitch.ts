import express = require('express');
import { credentialsConfig } from '../../config';
import { TwitchService } from '../../services/twitchService';
import { loggers } from 'winston';
import { TwitchOAuthService } from '../../services/oauth/twitchOAuthService';

const logger = loggers.get('logger');
const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
	logger.info('Start: TwitchOAuthService().checkTwitchAuth()');
	new TwitchOAuthService(credentialsConfig.twitch, logger).checkOAuth(req, res, next);
});

router.get('/followedStreams', (req, res) => {
	new TwitchService(credentialsConfig.twitch, logger).getFollowedStreams(res.locals.authResp)
		.then((apiResp) => res.apiResponse(apiResp))
		.catch((apiErr) => res.apiError(apiErr));
});

router.get('/userInfo', (req, res) => {
	new TwitchService(credentialsConfig.twitch, logger).getAuthUsersTwitchInfo(res.locals.authResp)
		.then((apiResp) => res.apiResponse(apiResp))
		.catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
