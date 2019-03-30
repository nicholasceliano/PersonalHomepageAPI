type StockQuoteData = {
	stockName: string;
	stockQty: number;
	lastStockVal: number;
	lastPriceVal: number;
	lastPriceDate: Date;
	currStockVal?: number;
	currPriceVal?: number;
	currPriceDate?: Date;
	priceDiffPercent?: number;
	dateDiff?: string;
};
