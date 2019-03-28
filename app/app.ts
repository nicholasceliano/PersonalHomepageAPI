import cookieParser = require('cookie-parser');
import express = require('express');
import { webConfig } from '../build/config';

const app = express();

require('./appMiddleware')(app);
require('./extensions/ArrayExt');
require('./extensions/NumberExt');

app.use(cookieParser());
app.use('/oauth/google', require('./routes/oauth/google'));
app.use('/api/gmail', require('./routes/api/gmail'));
app.use('/api/youtube', require('./routes/api/youtube'));
app.use('/api/weather', require('./routes/api/weather'));
app.use('/api/location', require('./routes/api/location'));
app.use('/api/currency', require('./routes/api/currency'));

module.exports = app.listen(webConfig().port);
