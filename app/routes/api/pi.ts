import express = require('express');
import { DHT11Service } from '../../services/pi/dht11Service';

const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
	next();
});

router.get('/temperature', (req, res) => {
	new DHT11Service().poll()
		.then((apiResp) => res.apiResponse(apiResp))
		.catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
