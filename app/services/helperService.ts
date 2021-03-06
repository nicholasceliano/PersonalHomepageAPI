export class HelperService {
	public getKeyByValue(object, value) {
		return Object.keys(object).find((key) => object[key] === value);
	}

	public calculatePercentChange(origVal: number, newVal: number): number {
		return parseFloat(((newVal - origVal) / origVal * 100).toFixed(2));
	}

	public daysBetweenDates(startDate, endDate) {
		// get total seconds between the times
		let delta = Math.abs(endDate - startDate) / 1000;

		// calculate (and subtract) whole days
		const days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// calculate (and subtract) whole hours
		const hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		// calculate (and subtract) whole minutes
		const minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;

		return `${days}d ${hours}h ${minutes}m`;
	}

	public formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
}
