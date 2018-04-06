var user = require('./controllers/user');
var event = require('./controllers/event');


module.exports = function (app) {
    app.post('/vc/register4VC', user.register4VC);
    app.post('/vc/login4VC', user.login4VC);
    app.get('/vc/getUserData', user.getUserData);
    app.post('/vc/updateUserStatus',user.updateUserStatus);
    app.post('/vc/deleteUser', user.deleteUser);
    app.post('/vc/emailInvite', user.emailInvite);
    app.post('/vc/sessionCreate', user.sessionCreate);
    app.post('/vc/teacherInsert', user.teacherInsert);
    app.post('/vc/studentInsert', user.studentInsert);

    app.post('/vc/eventSend', event.eventSend);
    app.get('/vc/eventGet/:id', event.eventGet);
    app.post('/vc/deleteEvent', event.deleteEvent);
    app.post('/vc/parentCredential', event.parentCredential);
    app.post('/vc/eventUpdate/:id', event.eventUpdate);
   
}