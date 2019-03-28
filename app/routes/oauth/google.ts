import express = require('express');
import { credentialsConfig, errorConfig, webConfig } from '../../config';
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';

const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
    next();
});

router.get('/getUserOAuth2Url', (req, res) => {
    const authorizationUrl = new GoogleOAuthService(credentialsConfig.google).getUserAuth2Url();
    res.json({ url: authorizationUrl });
});

router.get('/getTokenFromCode', (req, res) => {
    if (req.query.code) {
        const code = req.query.code;
        new GoogleOAuthService(credentialsConfig.google).getTokenFromCode(code).then((codeResp) => {
            res.redirect(`${webConfig().clientHostname}/googleAuth?uid=${codeResp}`);
        }).catch((err) => {
            res.redirect(`${webConfig().clientHostname}/error?err=${err}`);
        });
    } else {
        res.redirect(`${webConfig().clientHostname}/error?err=${errorConfig.codeParamRequired}`);
    }
});

module.exports = router;
