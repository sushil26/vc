

const log4js = require('log4js');

const log4js_extend = require("log4js-extend");

log4js.configure({
  appenders: { cheese: { type: 'file', filename: './cheese.log' } },
   categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const logger = log4js.getLogger("cheese");

log4js_extend(log4js, {
    path: __dirname,
    format: "at @name (@file:@line:@column)"
  });
Object.defineProperty(exports, "LOG", {
            value:logger,
});
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');