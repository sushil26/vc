var user = require('./controllers/user');
var event = require('./controllers/event');


module.exports = function (app) {

    app.post('/vc/register4VC', user.register4VC);
    app.post('/vc/login4VC', user.login4VC);
    
    app.post('/vc/eventSend', event.eventSend);
    app.get('/vc/eventGet', event.eventGet);
}