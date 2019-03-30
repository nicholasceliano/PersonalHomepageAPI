import express = require('express');
import { credentialsConfig, errorConfig, webConfig } from '../../config';
import { TwitchOAuthService } from '../../services/oauth/twitchOAuthService';
import { loggers } from 'winston';

const logger = loggers.get('logger');
const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
	next();
});

router.get('/getUserOAuth2Url', (req, res) => {
	const authorizationUrl = new TwitchOAuthService(credentialsConfig.twitch, logger).getUserAuth2Url();
	res.json({ url: authorizationUrl });
});

router.get('/getTokenFromCode', (req, res) => {
	if (req.query.code) {
		const code = req.query.code;
		new TwitchOAuthService(credentialsConfig.twitch, logger).getTokenFromCode(code).then((codeResp) => {
			logger.info(`End Request: ${req.originalUrl} - Redirected to ${webConfig().clientHostname}` +
						`/twitchAuth?uid=${codeResp}`);
			res.redirect(`${webConfig().clientHostname}/twitchAuth?uid=${codeResp}`);
		}).catch((err) => {
			logger.info(`End Request: ${req.originalUrl} - Redirected to ${webConfig().clientHostname}` +
						`/oautherror?e=${err}&o=Twitch`);
			res.redirect(`${webConfig().clientHostname}/oautherror?e=${err}&o=Twitch`);
		});
	} else {
		logger.info(`End Request: ${req.originalUrl} - Redirected to ${webConfig().clientHostname}` +
					`/oautherror?e=${errorConfig.codeParamRequired}&o=Twitch`);
		res.redirect(`${webConfig().clientHostname}/oautherror?e=${errorConfig.codeParamRequired}&o=Twitch`);
	}
});

module.exports = router;
