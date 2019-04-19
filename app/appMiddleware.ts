import express = require('express');
import { loggers } from 'winston';
import { webConfig } from './config';
const logger = loggers.get('logger');

module.exports = (app: express.Express) => {

	app.use((req, res, next) => {
		logger.info(`Start Request: ${req.originalUrl}`);

		res.header('Access-Control-Allow-Origin', `${webConfig().clientHostname}`);

		// check if CORS preflight
		if (req.header('Access-Control-Request-Method') && req.method === 'OPTIONS' && req.header('Origin')) {
			res.header('Access-Control-Allow-Credentials', 'true');
			res.header('Access-Control-Allow-Methods', 'GET,PUT');
			res.header('Access-Control-Allow-Headers', `Origin, X-Requested-With, Content-Type, Accept, ${webConfig().oAuthIDHeaderName}`);

			logger.info(`End Request: ${req.originalUrl} - CORS Preflight`);
			return res.sendStatus(200);
		}

		res.apiError = (error: string) => {
			logger.info(`End Request: ${req.originalUrl} - API Error: ${JSON.stringify(error)}`);
			return res.json({
				data: null,
				err: true,
				msg: 'The API returned an error: ' + error,
			} as APIResponse);
		};

		res.apiResponse = (respData: object) => {
			logger.info(`End Request: ${req.originalUrl} - API Response: ${JSON.stringify(respData)}`);
			return res.json({
				data: respData,
				err: false,
				msg: '',
			} as APIResponse);
		};

		next();
	});
};
