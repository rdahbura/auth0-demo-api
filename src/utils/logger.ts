import { createLogger, format, transports, LoggerOptions } from 'winston';

import { NODE_ENV } from './constants';

const { colorize, combine, printf, timestamp, uncolorize } = format;

const consoleFormat = printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const fileFormat = printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const consoleOptions: transports.ConsoleTransportOptions = {
  format: combine(colorize(), timestamp(), consoleFormat),
  level: NODE_ENV === 'production' ? 'error' : 'debug',
};

const fileOptions: transports.FileTransportOptions = {
  format: combine(uncolorize(), timestamp(), fileFormat),
  filename: 'debug.log',
  level: 'debug',
};

const loggerOptions: LoggerOptions = {
  transports: [
    new transports.Console(consoleOptions),
    new transports.File(fileOptions),
  ],
};

const logger = createLogger(loggerOptions);
logger.debug('Logging initialized at debug level.');

export default logger;
