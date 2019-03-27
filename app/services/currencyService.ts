import request = require('request');
import { MySqlService } from './mySqlService';
import { HelperService } from './helperService';

export class CurrencyService {

  constructor(private config: APIConfig,
    private mySql: MySqlService,
    private helper: HelperService) {}

  public getStockQuoteData(): Promise<StockQuoteData[]> {
    return new Promise((resolve, reject) => { 
      this.mySql.storedProcedure('getAllStockValues()').then((dbRes: any[]) => {
        var stockQuoteData: StockQuoteData[] = [];
        var commodities: string[] = []
        var symbols: string[] = []
        
        for (let i = 0; i < dbRes.length; i++) {
          if (dbRes[i].isCommodity) 
            commodities.push(dbRes[i].stockName)
          else 
            symbols.push(dbRes[i].stockName);
                    
          stockQuoteData.push({
            stockName: dbRes[i].stockName,
            stockQty: dbRes[i].stockQty,
            lastStockVal: dbRes[i].stockVal,
            lastPriceVal: dbRes[i].lastPriceVal,
            lastPriceDate: dbRes[i].lastPriceDate
          });
        }

        //get commodity quotes & fill response
        var commodityPromises:Promise<{}>[] = [];
        commodities.forEach(commodity => {
          commodityPromises.push(new Promise((resolve, reject) => {
            this.getCommodityExchangeRate(commodity).then((commResp) => {
              var commodityJSON = JSON.parse(commResp)["Realtime Currency Exchange Rate"];

              stockQuoteData = this.setExchangeRateToStockQuoteData(stockQuoteData, commodityJSON);
              resolve(stockQuoteData);
            }).catch((err) => reject(err));
          }))
        });
        
        //get stock quotes & fill response
        Promise.all(commodityPromises).then((resp) => {
          this.getBatchStockQuotesBySymbols(symbols).then((quotesResp) => {
            var quotesJSON = JSON.parse(quotesResp)['Stock Quotes'];
            
            stockQuoteData = this.setBatchStockQuotesToStockQuoteData(stockQuoteData, quotesJSON);
            resolve(stockQuoteData);
          });
        }).catch((err) => reject(err));
      });
    });
  }

  private getBatchStockQuotesBySymbols(symbols: string[]): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      request.get(`${this.config.APIUri}?function=BATCH_STOCK_QUOTES&symbols=${symbols.join(',')}&apikey=${this.config.APIKey}`, 
      (err, res, body) => {
        if (err) return reject(err);
        resolve(res.body);
      });
    });
  }

  private getCommodityExchangeRate(commoditySymbol: string): Promise<string> {
    return new Promise((resolve, reject) => {
      request.get(`${this.config.APIUri}?function=CURRENCY_EXCHANGE_RATE&from_currency=${commoditySymbol}&to_currency=USD&apikey=${this.config.APIKey}`, 
      (err, res, body) => {
        if (err) return reject(err);
        resolve(res.body);
      });
    });
  }

  private setExchangeRateToStockQuoteData(stockQuoteData: StockQuoteData[], exchangeRateJSON) {
    stockQuoteData.forEach(d => {
      if (d.stockName == exchangeRateJSON['1. From_Currency Code']){
        d.currPriceVal = parseFloat(exchangeRateJSON['5. Exchange Rate']);
        d.currPriceDate = new Date(exchangeRateJSON['6. Last Refreshed'] + " " + exchangeRateJSON['7. Time Zone']);
        
        if (d.currPriceVal) {
          d.priceDiffPercent = this.helper.calculatePercentChange(d.lastPriceVal, d.currPriceVal);
          d.currStockVal = d.currPriceVal * d.stockQty 
        }

        if (d.currPriceDate)
          d.dateDiff = this.helper.daysBetweenDates(d.lastPriceDate, d.currPriceDate)
      }
    });
    return stockQuoteData;
  }

  private setBatchStockQuotesToStockQuoteData(stockQuoteData: StockQuoteData[], quotesJSON) {
    stockQuoteData.forEach(d => {
      for (let i = 0; i < quotesJSON.length; i++) {
        if (d.stockName == quotesJSON[i]['1. symbol']){
          d.currPriceVal = parseFloat(quotesJSON[i]['2. price']);
          d.currPriceDate = new Date(quotesJSON[i]['4. timestamp']);
          
          if (d.currPriceVal) {
            d.priceDiffPercent = this.helper.calculatePercentChange(d.lastPriceVal, d.currPriceVal);
            d.currStockVal = d.currPriceVal * d.stockQty 
          }

          if (d.currPriceDate) 
            d.dateDiff = this.helper.daysBetweenDates(d.lastPriceDate, d.currPriceDate)
          
          break;
        }
      }
    });
    return stockQuoteData;
  }
}