import express = require('express');
import { credentialsConfig } from '../../config';
import { CurrencyService } from '../../services/currencyService';
import { HelperService } from '../../services/helperService';
import { MySqlService } from '../../services/mySqlService';

const router = express.Router();

// scope specific middleware
router.use((req, res, next) => {
    next();
});

router.get('/stockQuoteData', (req, res) => {
    new CurrencyService(credentialsConfig.alphaVantage,
        new MySqlService(credentialsConfig.gnuCash),
        new HelperService()).getStockQuoteData()
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
