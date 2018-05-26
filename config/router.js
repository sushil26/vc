var user = require('./controllers/user');
var event = require('./controllers/event');
var quickMsg = require('./controllers/quickMsg');
var image = require('./controllers/image');
var adminAction = require('./controllers/adminAction');
var school = require('./controllers/school');
var careator = require('./controllers/careator');

module.exports = function (app) {

    app.post('/careator/pswdGenerate', function(req,res){ careator.pswdGenerate});
    app.post('/careator/pswdCheck', function(req,res){ careator.pswdCheck});
    app.post('/careator/emailInvite', function(req,res){ careator.emailInvite});
    app.post('/vc/register4VC', function(req,res){ user.register4VC});
    app.post('/vc/login4VC', function(req,res){ user.login4VC});
    app.post('/vc/checkPassword/:id/:loginType', function(req,res){ user.checkPassword});
    app.post('/vc/passwordUpdate/:id/:loginType', function(req,res){ user.passwordUpdate});
    app.get('/vc/getUserData', function(req,res){ user.getUserData});
    app.get('/vc/getStudData', function(req,res){ user.getStudData});
    app.post('/vc/updateUserStatus', function(req,res){ user.updateUserStatus});
    app.post('/vc/updateStudStatus', function(req,res){ user.updateStudStatus});
    app.post('/vc/deleteUser', function(req,res){ user.deleteUser});
    app.post('/vc/deleteStud', function(req,res){ user.deleteStud});
    app.post('/vc/emailInvite', function(req,res){ user.emailInvite});
    app.post('/vc/sessionCreate', function(req,res){ user.sessionCreate});
    app.post('/vc/teacherInsert', function(req,res){ user.teacherInsert});
    app.post('/vc/studentInsert', function(req,res){ user.studentInsert});
    app.get('/vc/teacherDetail/:id', function(req,res){ user.teacherDetail});
    app.get('/vc/studentDetail/:id', function(req,res){ user.studentDetail});
    app.get('/vc/teacherPersonalData/:id', function(req,res){ user.teacherPersonalData});
    app.get('/vc/studentPersonalData/:id', function(req,res){ user.studentPersonalData});
    app.get('/vc/getLoginData/:id', function(req,res){ user.getLoginData});
    app.post('/vc/adminCreate', function(req,res){ user.adminCreate});
    app.get('/vc/getSchoolData/:schoolName', function(req,res){ school.getSchoolData});
    app.get('/vc/getSchoolDataById/:id', function(req,res){ school.getSchoolDataById});
    app.get('/vc/getSchoolList', function(req,res){ school.getSchoolList});
    app.get('/vc/getSchoolUser/:schoolName', function(req,res){ adminAction.getSchoolUser});
    app.get('/vc/getAllAdmin', function(req,res){ adminAction.getAllAdmin});
    app.get('/vc/getAllSchool', function(req,res){ adminAction.getAllSchool});
    app.get('/vc/getAllTeacherList/:schoolName/', function(req,res){ adminAction.getAllTeacherList});
    app.post('/vc/updateSchoolStatus', function(req,res){ adminAction.updateSchoolStatus});
    app.post('/vc/uploadClassFile/:schoolName', function(req,res){ adminAction.uploadClassFile});
    app.post('/vc/uploadPeriodsFile/:schoolName', function(req,res){ adminAction.uploadPeriodsFile});
    app.post('/vc/uploadStudentMaster/:schoolName/:clas/:section', function(req,res){ adminAction.uploadStudentMaster});
    app.post('/vc/updateStudentMaster/:schoolName/:id', function(req,res){ adminAction.updateStudentMaster});
    app.post('/vc/uploadTeacherMaster/:schoolName', function(req,res){ adminAction.uploadTeacherMaster});
    app.post('/vc/updateTeacherMaster/:schoolName/:id', function(req,res){ adminAction.updateTeacherMaster});
    app.post('/vc/uploadTeacher_timeTable/:schoolName/:id', function(req,res){ adminAction.uploadTeacher_timeTable});
    app.post('/vc/uploadMarkFile/:schoolName/:testType/:date/:clas/:section', function(req,res){ adminAction.uploadMarkFile});
    app.post('/vc/uploadAttendance/:schoolName/:clas/:section/:reportType/:month', function(req,res){ adminAction.uploadAttendance});
    app.post('/vc/updateTeacher_timeTable/:id', function(req,res){ adminAction.updateTeacher_timeTable});
    app.post('/vc/attendanceUpdate/:schoolName/:clas/:section/:reportType/:month', function(req,res){ adminAction.attendanceUpdate});
    app.post('/vc/markUpdate/:schoolName/:clas/:section/:testType/:date', function(req,res){ adminAction.markUpdate});
    app.post('/vc/schoolLogo', function(req,res){ image.upload});
    app.post('/vc/quickMsgSend', function(req,res){ quickMsg.quickMsgSend});
    app.get('/vc/quickMsgGet/:id', function(req,res){ quickMsg.quickMsgGet});
    app.get('/vc/quickMsgGetForStud/:id/:clas/:section', function(req,res){ quickMsg.quickMsgGetForStud});
    app.get('/vc/getQuickMsgById/:id', function(req,res){quickMsg.getQuickMsgById});
    app.post('/vc/bulkEmail_quickMsg', function(req,res){quickMsg.bulkEmail_quickMsg});
    app.get('/vc/getStudListForCS/:schoolName/:clas/:section', function(req,res){event.getStudListForCS});
    app.get('/vc/getTeacherListForCS/:schoolName/:clas/:section', function(req,res){event.getTeacherListForCS});
    app.get('/vc/getToDate', function(req,res){event.getToDate});
    app.post('/vc/eventSend', function(req,res){event.eventSend});
    app.get('/vc/eventGet/:id',  function(req,res){event.eventGet});
    app.post('/vc/eventReSchedule/:id', function(req,res){event.eventReSchedule});
    app.get('/vc/getEventById/:id', function(req,res){event.getEventById});
    app.get('/vc/getStudentAttendance/:id', function(req,res){event.getStudentAttendance});
    app.post('/vc/deleteEvent', function(req,res){event.deleteEvent});
    app.post('/vc/updateEventMOM/:eventId', function(req,res){event.updateEventMOM});
    app.post('/vc/parentCredential', function(req,res){event.parentCredential});
    //app.post('/vc/eventUpdate/:id', function(req,res){event.eventUpdate});


    // app.get('/vc/teacherGet/:id', function(req,res){event.teacherGet);
        //  app.post('/vc/uploadPayment', adminAction.uploadPayment);
    //app.post('/vc/csvTest', adminAction.csvTest);
    // app.post('/vc/atte', adminAction.getAllClass);


}