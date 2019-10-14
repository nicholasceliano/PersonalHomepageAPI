
import path = require('path');
import { format, loggers, transports } from 'winston';
import { webConfig } from './config';
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
		new (transports.File)({ filename: path.join(global.appRoot, '..', webConfig().logLocation, 'error.log'), level: 'error' }),
		new (transports.File)({ filename: path.join(global.appRoot, '..', webConfig().logLocation, 'warning.log'), level: 'warn' }),
		new (transports.File)({ filename: path.join(global.appRoot, '..', webConfig().logLocation, 'info.log'), level: 'info' }),
	],
});
