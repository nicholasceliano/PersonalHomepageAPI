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
        var lat = parseFloat(req.query.lat);
        var lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            res.apiError("'lat' and 'lng' query parameters must be floating-point numbers.");
        } else {
            new OpenWeatherMapService(config.credentialsConfig.openWeather).getCurrentWeatherByLocation(lat, lon)
            .then((apiResp) => res.apiResponse(apiResp))
            .catch((apiErr) => res.apiError(apiErr));
        }
    } else {
        res.apiError("'lat' and 'lng' query parameters required.")
    }
});

module.exports = router;
