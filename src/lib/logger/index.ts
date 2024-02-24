import { createLogger, format, transports } from 'winston';
import config from '../../config';

const logger = createLogger({
  transports: [
    new transports.File({
      level: 'error',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/error.log',
    }),
    new transports.File({
      level: 'info',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/info.log',
    }),
    new transports.Console({
      level: 'error',
      format: format.combine(
        format.timestamp({
          format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        format.colorize(),
        format.printf((info) => {
          if (info instanceof Error) {
            // Log error stack trace for error logs
            return `${info.timestamp} ${info.level}: ${info.message}\n${info.stack}`;
          }
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
    }),
  ],
  format: format.combine(
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    format.printf((info) => {
      if (info instanceof Error) {
        // Log error stack trace for error logs
        return `${info.timestamp} ${info.level}: ${info.message}\n${info.stack}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message}`;
    }),
  ),
});

if (config.nodeEnv !== 'production') {
  logger.add(
    new transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.timestamp({
          format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        format.colorize(),
        format.printf((info) => {
          if (info instanceof Error) {
            return `${info.timestamp} ${info.level}: ${info.message}\n${info.stack}\nFile: ${info.file}, Line: ${info.line}`;
          }
          if (info.level === 'error') {
            return `${info.timestamp} ${info.level}: ${info.message}${JSON.stringify(info)}`;
          }
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
    }),
  );
}

export default logger;