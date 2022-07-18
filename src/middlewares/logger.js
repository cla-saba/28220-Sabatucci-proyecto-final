const { logConsole } = require('../helpers/loggers.js');

const logger = (req, res, next) => {
  const { method, baseUrl } = req;
  const date = new Date(Date.now()).toISOString();
  logConsole.trace(date, method, baseUrl);
  next();
};

module.exports = logger;