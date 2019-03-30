import express = require('express');
import { webConfig } from '../build/config';
import { loggers } from 'winston';

require('./logger');

const app = express();
const logger = loggers.get('logger');
require('./appMiddleware')(app);
require('./extensions/ArrayExt');
require('./extensions/NumberExt');

app.use('/oauth/google', require('./routes/oauth/google'));
app.use('/oauth/twitch', require('./routes/oauth/twitch'));
app.use('/api/gmail', require('./routes/api/gmail'));
app.use('/api/youtube', require('./routes/api/youtube'));
app.use('/api/twitch', require('./routes/api/twitch'));
app.use('/api/weather', require('./routes/api/weather'));
app.use('/api/location', require('./routes/api/location'));
app.use('/api/currency', require('./routes/api/currency'));

app.use((error, req, res, next) => { // Exception Middleware. Needs to come after routes
	logger.error(error);
	next();
});

module.exports = app.listen(webConfig().port, () => logger.info(`App listening on port ${webConfig().port}!`));
