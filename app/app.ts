import express = require('express');
import config = require('./config');
const app = express();

app.use("/oauth/google",require('./routes/oauth/google'));

app.listen(config.webConfig.port, () => console.log(`App listening on port ${config.webConfig.port}!`));