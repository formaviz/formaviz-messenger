const pino = require('pino');

const logger = pino({
  prettyPrint: { colorize: true },
  level: process.env.LEVEL || 'info',
});

module.exports = logger;