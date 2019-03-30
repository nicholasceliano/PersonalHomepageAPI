import express = require('express');
import { credentialsConfig, errorConfig, webConfig } from '../../config';
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { loggers } from 'winston';

const logger = loggers.get('logger');
const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
	next();
});

router.get('/getUserOAuth2Url', (req, res) => {
	const authorizationUrl = new GoogleOAuthService(credentialsConfig.google, logger).getUserAuth2Url();
	res.json({ url: authorizationUrl });
});

router.get('/getTokenFromCode', (req, res) => {
	if (req.query.code) {
		const code = req.query.code;
		new GoogleOAuthService(credentialsConfig.google, logger).getTokenFromCode(code).then((codeResp) => {
			logger.info(`End Request: ${req.originalUrl} - Redirected to ${webConfig().clientHostname}` +
						`/googleAuth?uid=${codeResp}`);
			res.redirect(`${webConfig().clientHostname}/googleAuth?uid=${codeResp}`);
		}).catch((err) => {
			logger.info(`End Request: ${req.originalUrl} - Redirected to ${webConfig().clientHostname}` +
						`/oautherror?e=${err}&o=Google`);
			res.redirect(`${webConfig().clientHostname}/oautherror?e=${err}&o=Google`);
		});
	} else {
		logger.info(`End Request: ${req.originalUrl} - Redirected to ${webConfig().clientHostname}` +
					`/oautherror?e=${errorConfig.codeParamRequired}&o=Google`);
		res.redirect(`${webConfig().clientHostname}/oautherror?e=${errorConfig.codeParamRequired}&o=Google`);
	}
});

module.exports = router;
