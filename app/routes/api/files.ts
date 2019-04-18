import express = require('express');
import { FilesService } from '../../services/filesService';
import { HelperService } from '../../services/helperService';
import { errorConfig } from '../../config';

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

router.get('/openFile', (req, res) => {
	const type = parseInt(req.query.type, 10);
	const path = req.query.path;
	const fileName = req.query.fileName;
	if (type && path && fileName) {
		new FilesService(new HelperService()).getFile(type, path, fileName)
			.then((apiResp) => res.apiResponse(apiResp))
			.catch((apiErr) => res.apiError(apiErr));
	} else {
		res.apiError(errorConfig.pathTypeFileNameReq);
	}
});

module.exports = router;
