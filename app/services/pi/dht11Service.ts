import sensorLib = require('node-dht-sensor');

export class DHT11Service {
	private sensor = {
		name: 'Indoor',
		pin: 22,
		type: 11,
	};

	public poll(): Promise<TemperatureData> {
		return new Promise((resolve, reject) => {
			resolve(this.read());
		});
	}

	private read() {
		const readout = sensorLib.read(this.sensor.type, this.sensor.pin);
		const tempFarenheit = (readout.temperature * 9 / 5) + 32;

		return {
			humidity: readout.humidity,
			name: this.sensor.name,
			temp: tempFarenheit,
		} as TemperatureData;
	}
}
