import express = require('express');
import { errorConfig, credentialsConfig } from '../../config';
import { LocationService } from '../../services/locationService';
import { HelperService } from '../../services/helperService';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => { 
    next();
});

router.get('/addressFromCoords', (req, res) => {
    if (req.query.lat && req.query.lon) {
        var lat = parseFloat(req.query.lat);
        var lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            res.apiError(errorConfig.latLngMustBeFloat);
        } else {
            new LocationService(credentialsConfig.openStreetMap, new HelperService()).getAddressFromCoords(lat, lon)
            .then((apiResp) => res.apiResponse(apiResp))
            .catch((apiErr) => res.apiError(apiErr));
        }
    } else {
        res.apiError(errorConfig.latLngRequired)
    }
});

module.exports = router;
