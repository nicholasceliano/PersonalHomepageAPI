import express = require('express');
import config = require('./config');
import cookieParser = require('cookie-parser');
const app = express();

require("./appMiddleware")(app);
require("./extensions/ArrayExt");

app.use(cookieParser());
app.use("/oauth/google",require('./routes/oauth/google'));
app.use("/api/gmail",require('./routes/api/gmail'));

app.listen(config.webConfig.port, () => console.log(`App listening on port ${config.webConfig.port}!`));