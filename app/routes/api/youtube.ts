import express = require('express');
import { GoogleOAuthService } from '../../services/oauth/googleOAuthService';
import { GoogleAuth } from 'google-auth-library';
import config = require('../../config');
import { GoogleApis } from 'googleapis';
import { YoutubeService } from '../../services/youtubeService';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => {
    new GoogleOAuthService(new GoogleAuth(), config.oauthConfig.google).checkGapiAuth(req, res, next);
});

router.get('/watchlist', (req, res) => {
    new YoutubeService(new GoogleApis()).getWatchlistVideos(res.locals.authResp)
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
});

router.get('/subscription', (req, res) => {
    new YoutubeService(new GoogleApis()).getSubscriptionVidoes(res.locals.authResp)
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
