var expect = require("chai").expect;
var CurrencyService = require("../../../build/services/currencyService").CurrencyService;
var MySqlService = require("../../../build/services/mySqlService").MySqlService;
var HelperService = require("../../../build/services/helperService").HelperService;
var config = require("../../../build/config");

describe("CurrencyService", function() {
    describe("getStockQuoteData", function() {
        it("should return aggregated stock quote data from database and api", function() {
            return new CurrencyService(config.credentialsConfig.alphaVantage,
                new MySqlService(config.credentialsConfig.gnuCash),
                new HelperService()).getStockQuoteData().then(res => {
                    expect(res).to.be.an("array");
                    expect(res).lengthOf.above(0);
                }).catch(err => {
                    expect(err).to.be.an("object");
                });
        });
    });
    describe("getBatchStockQuotesBySymbols", function() {
        it("should return the correct output type and size", function() {
            return new CurrencyService(config.credentialsConfig.alphaVantage,
                new MySqlService(config.credentialsConfig.gnuCash),
                new HelperService()).getBatchStockQuotesBySymbols(["MSFT", "AAPL"]).then(res => {
                    expect(res).to.be.a("string");
                    var noteNode = "Note";
                    var parsedResp = JSON.parse(res);
                    if (parsedResp[noteNode]) {
                        expect(parsedResp[noteNode]).to.be.a("string");
                    } else {
                        var quotesJSON = parsedResp["Stock Quotes"];
                        expect(quotesJSON).to.be.an("array");
                        expect(quotesJSON[0]["1. symbol"]).to.equal("MSFT");
                        expect(quotesJSON[0]["2. price"]).to.be.a("string");
                        expect(quotesJSON[0]["3. volume"]).to.be.a("string");
                        expect(quotesJSON[0]["4. timestamp"]).to.be.a("string");
                        expect(quotesJSON).lengthOf(2);
                    }
                });
        });
        //test bad inputs
    });
    describe("getCommodityExchangeRate", function() {
        it("should return the correct output type", function() {
            return new CurrencyService(config.credentialsConfig.alphaVantage,
                new MySqlService(config.credentialsConfig.gnuCash),
                new HelperService()).getCommodityExchangeRate("XAU").then(res => {
                    expect(res).to.be.a("string");
                    var noteNode = "Note";
                    var parsedResp = JSON.parse(res);
                    if (parsedResp[noteNode]) {
                        expect(parsedResp[noteNode]).to.be.a("string");
                    } else {
                        var commodityJSON = parsedResp["Realtime Currency Exchange Rate"];
                        expect(commodityJSON).to.be.an("object");
                        expect(commodityJSON["1. From_Currency Code"]).to.equal("XAU");
                        expect(commodityJSON["2. From_Currency Name"]).to.equal(null);
                        expect(commodityJSON["3. To_Currency Code"]).to.equal("USD");
                        expect(commodityJSON["4. To_Currency Name"]).to.equal("United States Dollar");
                        expect(commodityJSON["5. Exchange Rate"]).to.be.a("string");
                        expect(commodityJSON["6. Last Refreshed"]).to.be.a("string");
                        expect(commodityJSON["7. Time Zone"]).to.equal("UTC");
                    }
                });
        });
    });
    describe("setExchangeRateToStockQuoteData", function() {
        it("should return the correct output", function() {
            //ignoring because of API limitations
            var exchangeRateJSON = {
                "1. From_Currency Code": "BTC",
                "2. From_Currency Name": "Bitcoin",
                "3. To_Currency Code": "CNY",
                "4. To_Currency Name": "Chinese Yuan",
                "5. Exchange Rate": "27980.01000000",
                "6. Last Refreshed": "2019-03-27 19:13:22",
                "7. Time Zone": "UTC",
            };

            var stockQuoteDataInput = [{
                lastPriceDate: new Date("1/1/2019 12:00 AM"),
                lastPriceVal: 50.55,
                lastStockVal: 5055,
                stockName: "BTC",
                stockQty: 100,
            }];

            var stockQuoteData = new CurrencyService(config.credentialsConfig.alphaVantage,
                new MySqlService(config.credentialsConfig.gnuCash),
                new HelperService()).setExchangeRateToStockQuoteData(stockQuoteDataInput, exchangeRateJSON);

            expect(stockQuoteData).to.deep.equal([{
                currPriceDate: new Date("2019-03-27 19:13:22 UTC"),
                currPriceVal: 27980.01,
                currStockVal: 2798001,
                dateDiff: "85d 14h 13m",
                lastPriceDate: new Date("1/1/2019 12:00 AM"),
                lastPriceVal: 50.55,
                lastStockVal: 5055,
                priceDiffPercent: 55251.16,
                stockName: "BTC",
                stockQty: 100,
            }]);
        });
    });
    describe("setBatchStockQuotesToStockQuoteData", function() {
        it("should return the correct output", function() {
            var batchStockQuoteJSON = [
                {
                    "1. symbol": "MSFT",
                    "2. price": "116.7150",
                    "3. volume": "15177153",
                    "4. timestamp": "2019-03-27 14:49:30",
                },
                {
                    "1. symbol": "AAPL",
                    "2. price": "188.4800",
                    "3. volume": "22991958",
                    "4. timestamp": "2019-03-27 14:49:31",
                },
            ];

            var stockQuoteDataInput = [{
                lastPriceDate: new Date("1/1/2019 12:00 AM"),
                lastPriceVal: 50.55,
                lastStockVal: 5055,
                stockName: "MSFT",
                stockQty: 100,
            },
            {
                lastPriceDate: new Date("1/1/2019 12:00 AM"),
                lastPriceVal: 50.55,
                lastStockVal: 5055,
                stockName: "AAPL",
                stockQty: 100,
            }];

            var stockQuoteData = new CurrencyService(config.credentialsConfig.alphaVantage,
                new MySqlService(config.credentialsConfig.gnuCash),
                new HelperService()).setBatchStockQuotesToStockQuoteData(stockQuoteDataInput, batchStockQuoteJSON);

            expect(stockQuoteData).to.deep.equal([{
                currPriceDate: new Date("2019-03-27 14:49:30"),
                currPriceVal: 116.715,
                currStockVal: 11671.5,
                dateDiff: "85d 13h 49m",
                lastPriceDate: new Date("1/1/2019 12:00 AM"),
                lastPriceVal: 50.55,
                lastStockVal: 5055,
                priceDiffPercent: 130.89,
                stockName: "MSFT",
                stockQty: 100,
            },
            {
                currPriceDate: new Date("2019-03-27 14:49:31"),
                currPriceVal: 188.48,
                currStockVal: 18848,
                dateDiff: "85d 13h 49m",
                lastPriceDate: new Date("1/1/2019 12:00 AM"),
                lastPriceVal: 50.55,
                lastStockVal: 5055,
                priceDiffPercent: 272.86,
                stockName: "AAPL",
                stockQty: 100,
            }]);
        });
    });
});
