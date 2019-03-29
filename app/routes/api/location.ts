import express = require('express');
import { credentialsConfig, errorConfig } from '../../config';
import { HelperService } from '../../services/helperService';
import { LocationService } from '../../services/locationService';
import { loggers } from 'winston';

const logger = loggers.get('logger');
const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
    next();
});

router.get('/addressFromCoords', (req, res) => {
    if (req.query.lat && req.query.lon) {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            res.apiError(errorConfig.latLngMustBeFloat);
        } else {
            new LocationService(credentialsConfig.openStreetMap, new HelperService()).getAddressFromCoords(lat, lon)
            .then((apiResp) => res.apiResponse(apiResp))
            .catch((apiErr) => res.apiError(apiErr));
        }
    } else {
        res.apiError(errorConfig.latLngRequired);
    }
});

module.exports = router;
