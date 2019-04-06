import express = require('express');
import { FilesService } from '../../services/filesService';
import { HelperService } from '../../services/helperService';

const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
	next();
});

router.get('/guitarTabs', (req, res) => {
	new FilesService(new HelperService()).getGuitarTabs()
		.then((apiResp) => res.apiResponse(apiResp))
		.catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
