import express = require('express');
import { loggers } from 'winston';
const logger = loggers.get('logger');

module.exports = (app: express.Express) => {

    app.use((req, res, next) => {
        logger.info(`Start Request: ${req.originalUrl}`);

        res.apiError = (error: string) => {
            logger.info(`End Request: ${req.originalUrl} - API Error: ${JSON.stringify(error)}`);
            return res.json({
                data: [],
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
