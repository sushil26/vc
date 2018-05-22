var user = require('./controllers/user');
var event = require('./controllers/event');
var image = require('./controllers/image');
var adminAction = require('./controllers/adminAction');
var school = require('./controllers/school');
var careator = require('./controllers/careator');

module.exports = function (app) {

    app.post('/careator/pswdGenerate', careator.pswdGenerate);
    app.post('/careator/pswdCheck', careator.pswdCheck);
    app.post('/careator/emailInvite', careator.emailInvite);

    app.post('/vc/register4VC', user.register4VC);
    app.post('/vc/login4VC', user.login4VC);
    app.post('/vc/checkPassword/:id/:loginType', user.checkPassword);
    app.post('/vc/passwordUpdate/:id/:loginType', user.passwordUpdate);
    app.get('/vc/getUserData', user.getUserData);
    app.get('/vc/getStudData', user.getStudData);
    app.post('/vc/updateUserStatus', user.updateUserStatus);
    app.post('/vc/updateStudStatus', user.updateStudStatus);
    app.post('/vc/deleteUser', user.deleteUser);
    app.post('/vc/deleteStud', user.deleteStud);
    app.post('/vc/emailInvite', user.emailInvite);
    app.post('/vc/sessionCreate', user.sessionCreate);
    app.post('/vc/teacherInsert', user.teacherInsert);
    app.post('/vc/studentInsert', user.studentInsert);
    app.get('/vc/teacherDetail/:id', user.teacherDetail);
    app.get('/vc/studentDetail/:id', user.studentDetail);
    app.get('/vc/teacherPersonalData/:id', user.teacherPersonalData);
    app.get('/vc/studentPersonalData/:id', user.studentPersonalData);
    app.get('/vc/getLoginData/:id', user.getLoginData);
    app.post('/vc/adminCreate', user.adminCreate);
    app.get('/vc/getSchoolData/:schoolName', school.getSchoolData);
    app.get('/vc/getSchoolDataById/:id', school.getSchoolDataById);
    app.get('/vc/getSchoolList', school.getSchoolList);
    app.get('/vc/getSchoolUser/:schoolName', adminAction.getSchoolUser);
    app.get('/vc/getAllAdmin', adminAction.getAllAdmin);
    app.get('/vc/getAllSchool', adminAction.getAllSchool);
    app.get('/vc/getAllTeacherList/:schoolName/', adminAction.getAllTeacherList);
    app.post('/vc/updateSchoolStatus', adminAction.updateSchoolStatus);
    app.post('/vc/uploadClassFile/:schoolName', adminAction.uploadClassFile);
    app.post('/vc/uploadPeriodsFile/:schoolName', adminAction.uploadPeriodsFile);
    app.post('/vc/uploadStudentMaster/:schoolName/:clas/:section', adminAction.uploadStudentMaster);
    app.post('/vc/updateStudentMaster/:schoolName/:id', adminAction.updateStudentMaster);
    app.post('/vc/uploadTeacherMaster/:schoolName', adminAction.uploadTeacherMaster);
    app.post('/vc/updateTeacherMaster/:schoolName/:id', adminAction.updateTeacherMaster);
    app.post('/vc/uploadTeacher_timeTable/:schoolName/:id', adminAction.uploadTeacher_timeTable);
    app.post('/vc/uploadMarkFile/:schoolName/:testType/:date/:clas/:section', adminAction.uploadMarkFile);
    app.post('/vc/uploadAttendance/:schoolName/:clas/:section/:reportType/:month', adminAction.uploadAttendance);
    app.post('/vc/updateTeacher_timeTable/:id', adminAction.updateTeacher_timeTable);
    app.post('/vc/attendanceUpdate/:schoolName/:clas/:section/:reportType/:month', adminAction.attendanceUpdate);
    app.post('/vc/markUpdate/:schoolName/:clas/:section/:testType/:date', adminAction.markUpdate);
    //  app.post('/vc/uploadPayment', adminAction.uploadPayment);

    // app.post('/vc/atte', adminAction.getAllClass);

    app.get('/vc/getStudListForCS/:schoolName/:clas/:section', event.getStudListForCS);
    app.get('/vc/getTeacherListForCS/:schoolName/:clas/:section', event.getTeacherListForCS);
    app.post('/vc/eventSend', event.eventSend);
    app.post('/vc/eventReSchedule/:id', event.eventReSchedule);
    app.get('/vc/getToDate', event.getToDate);
    app.get('/vc/eventGet/:id', event.eventGet);
    app.get('/vc/getEventById/:id', event.getEventById);
    app.get('/vc/getStudentAttendance/:id', event.getStudentAttendance);
    app.post('/vc/deleteEvent', event.deleteEvent);
    app.post('/vc/updateEventMOM/:eventId', event.updateEventMOM);
    app.post('/vc/parentCredential', event.parentCredential);
    app.post('/vc/eventUpdate/:id', event.eventUpdate);







    // app.get('/vc/teacherGet/:id', event.teacherGet);

}