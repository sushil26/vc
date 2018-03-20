var user = require('./controllers/user');

module.exports = function (app) {

    app.post('/vc/register4VC', user.register4VC);

    app.post('/vc/login4VC', user.login4VC);
}