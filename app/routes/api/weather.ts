import express = require('express');
import { OpenWeatherMapService } from '../../services/openWeatherMapService';
import { errorConfig, credentialsConfig } from '../../config';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => { 
    next();
});

router.get('/currentWeather', (req, res) => {
    if (req.query.lat && req.query.lon) {
        var lat = parseFloat(req.query.lat);
        var lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            res.apiError(errorConfig.latLngMustBeFloat);
        } else {
            new OpenWeatherMapService(credentialsConfig.openWeather).getCurrentWeatherByLocation(lat, lon)
            .then((apiResp) => res.apiResponse(apiResp))
            .catch((apiErr) => res.apiError(apiErr));
        }
    } else {
        res.apiError(errorConfig.latLngRequired);
    }
});

module.exports = router;
