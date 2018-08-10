
// var log4js = require('log4js');
// log4js.configure({
//   appenders: [
//     { type: 'console' },
//     { type: 'file', filename: '../logs/debugg.log', category: 'app' }
//   ]
// });

// var logger = log4js.getLogger('cheese'); 
// logger.warn('Cheese is quite smelly.');
// logger.info('Cheese is Gouda.');
// logger.debug('Cheese is not a food.');

const log4js = require('log4js');

const log4js_extend = require("log4js-extend");

log4js.configure({
  appenders: { cheese: { type: 'file', filename: './logs/loginDetails.log' } },
  categories: { default: { appenders: ['cheese'], level: 'all' } }
});

log4js_extend(log4js, {
    path: __dirname,
    format: "at @name (@file:@line:@column)"
  });
   
  const logger = log4js.getLogger("cheese");
// ----  

 
// const logger = log4js.getLogger('cheese');
//logger.setLevel('DEBUG');
Object.defineProperty(exports, "LOG", {
            value:logger,
});
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');