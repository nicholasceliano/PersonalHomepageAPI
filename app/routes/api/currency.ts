import express = require('express');
import config = require('../../config')
import { CurrencyService } from '../../services/currencyService';
import { MySqlService } from '../../services/mySqlService';
import { HelperService } from '../../services/helperService';

const router = express.Router();

//scope specific middleware
router.use((req, res, next) => { 
    next();
});

router.get('/stockQuoteData', (req, res) => {
    new CurrencyService(config.credentialsConfig.alphaVantage, 
        new MySqlService(config.credentialsConfig.gnuCash),
        new HelperService()).getStockQuoteData()
        .then((apiResp) => res.apiResponse(apiResp))
        .catch((apiErr) => res.apiError(apiErr));
});

module.exports = router;
