import request = require('request');
import { HelperService } from './helperService';
import { MySqlService } from './mySqlService';

export class CurrencyService {

	constructor(
		private config: APIConfig,
		private mySql: MySqlService,
		private helper: HelperService) { }

	public getStockQuoteData(): Promise<StockQuoteData[]> {
		return new Promise((resolve, reject) => {
			this.mySql.storedProcedure('getAllStockValues()').then((dbRes: any[]) => {
				let stockQuoteData: StockQuoteData[] = [];
				const commodities: string[] = [];
				const symbols: string[] = [];

				for (const dbr of dbRes) {
					if (dbr.isCommodity) commodities.push(dbr.stockName);
					else symbols.push(dbr.stockName);

					stockQuoteData.push({
						lastPriceDate: dbr.lastPriceDate,
						lastPriceVal: dbr.lastPriceVal,
						lastStockVal: dbr.stockVal,
						quoteExists: false,
						stockName: dbr.stockName,
						stockQty: dbr.stockQty,
					});
				}

				// get commodity quotes & fill response
				const commodityPromises: Array<Promise<{}>> = [];
				commodities.forEach((commodity) => {
					commodityPromises.push(new Promise((commodityResolve, commodityReject) => {
						this.getCommodityExchangeRate(commodity).then((commResp) => {
							const parsedJSON = JSON.parse(commResp);
							const exchangeRateNode = 'Realtime Currency Exchange Rate';

							if (!parsedJSON[exchangeRateNode]) return reject(parsedJSON);

							stockQuoteData = this.setExchangeRateToStockQuoteData(stockQuoteData, parsedJSON[exchangeRateNode]);
							commodityResolve(stockQuoteData);
						}).catch((err) => reject(err));
					}));
				});

				// get stock quotes & fill response
				Promise.all(commodityPromises).then((resp) => {
					this.getBatchStockQuotesBySymbols(symbols).then((quotesResp) => {
						const parsedJSON = JSON.parse(quotesResp);
						const stockNode = 'Stock Quotes';

						if (!parsedJSON[stockNode]) return reject(parsedJSON);

						stockQuoteData = this.setBatchStockQuotesToStockQuoteData(stockQuoteData, parsedJSON[stockNode]);
						resolve(stockQuoteData);
					});
				}).catch((err) => reject(err));
			});
		});
	}

	private getBatchStockQuotesBySymbols(symbols: string[]): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			request.get(`${this.config.APIUri}?function=BATCH_STOCK_QUOTES&symbols=${symbols.join(',')}` +
					`&apikey=${this.config.APIKey}`,
			(err, res, body) => {
				if (err) return reject(err);
				resolve(res.body);
			});
		});
	}

	private getCommodityExchangeRate(commoditySymbol: string): Promise<string> {
		return new Promise((resolve, reject) => {
			request.get(`${this.config.APIUri}?function=CURRENCY_EXCHANGE_RATE&from_currency=${commoditySymbol}` +
						`&to_currency=USD&apikey=${this.config.APIKey}`,
			(err, res, body) => {
				if (err) return reject(err);
				resolve(res.body);
			});
		});
	}

	private setExchangeRateToStockQuoteData(stockQuoteData: StockQuoteData[], exchangeRateJSON) {
		stockQuoteData.forEach((d) => {
			if (d.stockName === exchangeRateJSON['1. From_Currency Code']) {
				d.currPriceVal = parseFloat(exchangeRateJSON['5. Exchange Rate']);
				d.currPriceDate = new Date(exchangeRateJSON['6. Last Refreshed'] + ' ' + exchangeRateJSON['7. Time Zone']);

				if (d.currPriceVal) {
				d.priceDiffPercent = this.helper.calculatePercentChange(d.lastPriceVal, d.currPriceVal);
				d.currStockVal = d.currPriceVal * d.stockQty;
				}

				if (d.currPriceDate) d.dateDiff = this.helper.daysBetweenDates(d.lastPriceDate, d.currPriceDate);

				d.quoteExists = true;
			}
		});
		return stockQuoteData;
	}

	private setBatchStockQuotesToStockQuoteData(stockQuoteData: StockQuoteData[], quotesJSON) {
		stockQuoteData.forEach((d) => {
			for (const quote of quotesJSON) {
				if (d.stockName === quote['1. symbol']) {
					d.currPriceVal = parseFloat(quote['2. price']);
					d.currPriceDate = new Date(quote['4. timestamp']);

					if (d.currPriceVal) {
						d.priceDiffPercent = this.helper.calculatePercentChange(d.lastPriceVal, d.currPriceVal);
						d.currStockVal = d.currPriceVal * d.stockQty;
					}

					if (d.currPriceDate) d.dateDiff = this.helper.daysBetweenDates(d.lastPriceDate, d.currPriceDate);

					d.quoteExists = true;
					break;
				}
			}

			if (!d.quoteExists) {
				d.currPriceVal = d.lastPriceVal;
				d.currPriceDate = d.lastPriceDate;
				d.priceDiffPercent = this.helper.calculatePercentChange(d.lastPriceVal, d.currPriceVal);
				d.currStockVal = d.lastPriceVal * d.stockQty;
				d.dateDiff = this.helper.daysBetweenDates(d.lastPriceDate, d.currPriceDate);
			}
		});
		return stockQuoteData;
	}
}
