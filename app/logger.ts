import { webConfig } from '../build/config';
import { format, loggers, transports } from 'winston';
const { combine, label, timestamp, printf  } = format;

export {};

loggers.add('logger', {
	format: combine(
		label({ label: webConfig().env }),
		timestamp(),
		format.splat(),
		// tslint:disable:no-shadowed-variable
		printf(({ level, message, label, timestamp }) => {
			return `${timestamp} [${label}] ${level}: ${message}`;
		}),
	),
	transports: [
		// new (transports.Console)(),
		new (transports.File)({ filename: `${webConfig().logLocation}/error.log`, level: 'error' }),
		new (transports.File)({ filename: `${webConfig().logLocation}/info.log`, level: 'info' }),
	],
});
