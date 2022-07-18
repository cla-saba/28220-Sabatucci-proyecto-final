const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'console' },
    app: { type: 'file', filename: 'logs/logs.log' }
  },
  categories: {
    default: { appenders: ['out'], level: 'trace' },
    app: { appenders: ['app'], level: 'trace' }
  }
});

const logConsole = log4js.getLogger();
const logFile = log4js.getLogger('app');

module.exports = { logConsole, logFile };
