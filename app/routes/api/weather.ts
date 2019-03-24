import express = require('express');
import { OpenWeatherMapService } from '../../services/openWeatherMapService';
import config = require('../../config')

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => { 
    next();
});

router.get('/currentWeather', (req, res) => {
    if (req.query.lat && req.query.lon) {
        var lat = req.query.lat;
        var lon = req.query.lon;
        new OpenWeatherMapService(config.credentialsConfig.openWeather).getCurrentWeatherByLocation(lat, lon)
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
    } else {
        res.apiError("'lat' and 'lng' query parameters required.")
    }
});

module.exports = router;
