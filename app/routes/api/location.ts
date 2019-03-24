import express = require('express');
import config = require('../../config')
import { LocationService } from '../../services/locationService';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => { 
    next();
});

router.get('/addressFromCoords', (req, res) => {
    if (req.query.lat && req.query.lon) {
        var lat = req.query.lat;
        var lon = req.query.lon;
        new LocationService(config.credentialsConfig.openStreetMap).getAddressFromCoords(lat, lon)
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
    } else {
        res.apiError("'lat' and 'lng' query parameters required.")
    }
});

module.exports = router;
