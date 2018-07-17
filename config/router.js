var user = require('./controllers/user');
var event = require('./controllers/event');
var quickMsg = require('./controllers/quickMsg');
var image = require('./controllers/image');
var adminAction = require('./controllers/adminAction');
var school = require('./controllers/school');
var careator = require('./controllers/careator');

var record = require('./controllers/record');
var capture = require('./controllers/capture');

module.exports = function (app) {

    app.post('/careator/pswdGenerate', careator.pswdGenerate);
    app.post('/careator/pswdCheck', careator.pswdCheck);
    app.post('/careator/emailInvite', careator.emailInvite);
    app.post('/careator/RemoteJoinCheck', careator.RemoteJoinCheck);
    app.post('/careator/setCollection', careator.setCollection);
    app.get('/chatHistory/getHistory', careator.getHistory);
    app.get('/chatHistory/getHistoryByEmailId/:email', careator.getHistoryByEmailId);
    app.post('/careator_profile/chatStatusUpdateById/:id', careator.chatStatusUpdateById);
    app.get('/careator_adminBasicData/getAdminObjectId',careator.getAdminObjectId);
    app.post('/careator/careatorMasterInsert', careator.careatorMasterInsert);
    app.post('/careator/careatorSingleUserInsert', careator.careatorSingleUserInsert);
    app.get('/careator/careator_getAllEmp', careator.careator_getAllEmp);
    app.post('/careator/statusChangeById', careator.statusChangeById);
    app.post('/careator/groupStatusChangeById', careator.groupStatusChangeById);
    app.get('/careator_getChatListRecordById/getChatListRecordById/:id', careator.getChatListRecordById);
    app.get('/careator_userDelete/userDeleteById/:id', careator.userDeleteById);
    app.get('/careator_groupDelete/groupDeleteById/:id', careator.groupDeleteById);
    app.post('/careator/userEditById/:id', careator.userEditById);
    app.post('/careator/groupEditById/:id', careator.groupEditById);
    app.get('/careator_getUser/careator_getUserById/:id', careator.careator_getUserById);
    app.get('/careator_getGroup/careator_getGroupById/:id', careator.careator_getGroupById);
    app.get('/careator/getChatRights_emp', careator.getChatRights_emp);
    app.get('/careator/getVideoRights_emp', careator.getVideoRights_emp);
    app.get('/careator/careator_getChatVideo_emp', careator.careator_getChatVideo_emp);
    app.post('/careator/careator_chat_creteGroup', careator.careator_chat_creteGroup);
    app.post('/careator_groupUpdate/groupUpdateById/:id', careator.groupUpdateById);
    app.post('/careator_restrictedTo/restrictedTo/:id', careator.restrictedTo);
    app.post('/careator_restrictedToSave/restrictedToSave/:id', careator.restrictedToSave);
    app.post('/careator_removeRestrictedUserById/removeRestrictedUserById/:id', careator.removeRestrictedUserById);
    app.get('/careator_getChatsById/getChatsById/:id', careator.getChatsById);
    //app.post('/careator/careator_video_creteGroup', careator.careator_video_creteGroup);
    //app.post('/careator/careator_chatVideo_creteGroup', careator.careator_chatVideo_creteGroup);
   
    app.get('/careator_chatGroupList/careator_getChatGroupListById/:id', careator.careator_getChatGroupListById);
    app.get('/careator_chatGroupList/careator_getChatGroupList', careator.careator_getChatGroupList);
    app.post('/careator_getEmp/careator_getChatRightsAllemp/:id', careator.careator_getChatRightsAllemp);
    app.get('/careator_getEmp/careator_getChatRightsAllemp_byLoginId/:id', careator.careator_getChatRightsAllemp_byLoginId);
    app.post('/careator_individualText/individualText', careator.individualText);
    app.get('/careator_individualTextRead/individualTextReadById/:sId/:rId', careator.individualTextReadById);
    app.get('/careator_groupTextRead/groupTextReadByGroupId/:group_id', careator.groupTextReadByGroupId);
    app.post('/careator_groupText/groupText', careator.groupText);
    //app.get('/careator_groupTextRead/groupTextReadById/:sId/:rId', careator.groupTextReadById); /* Note: this api methos is not defining on the careator.js */
   

    app.post('/vc/login4VC', user.login4VC);
    app.post('/record/pswdGenerate', record.pswdGenerate);
    app.post('/record/pswdCheck', record.pswdCheck);
    app.post('/record/emailInvite', record.emailInvite);
    app.post('/record/recordVideo', record.recordVideo);
    app.get('/getRecord/getRecordVideo/:id', record.getRecordVideo);
    app.get('/record/getVideo/:id', record.getRecordVideo);

   
    app.post('/vc/captureImgSend/:parentEmail/:studName', capture.captureImgSend);
    app.post('/vc/schoolLogo', image.upload);
    app.post('/vc/profilePicupload', image.profilePicupload);
    app.post('/vc/register4VC', user.register4VC);
    
    app.post('/vc/checkPassword/:id/:loginType', user.checkPassword);
    app.post('/vc/passwordUpdate/:id/:loginType', user.passwordUpdate);
    app.post('/vc/updateProfilePic/:id', user.profilePicUpdate);
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
    //app.get('/vc/getschoollogoPath/:schoolName', school.getschoollogoPath);
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
    app.post('/vc/feeUpdate/:schoolName/:clas/:section/:reportType', adminAction.feeUpdate);
    app.post('/vc/uploadFeeFile/:schoolName/:clas/:section/:reportType/:fee_otherName', adminAction.uploadFeeFile);
    app.post('/vc/quickMsgSend', quickMsg.quickMsgSend);
    app.post('/vc/quickMsgNotificationOff', quickMsg.quickMsgNotificationOff);
    app.get('/vc/quickMsgGet/:id', quickMsg.quickMsgGet);
    app.get('/vc/quickMsgGetForStud/:id/:clas/:section', quickMsg.quickMsgGetForStud);
    app.get('/vc/getQuickMsgById/:id', quickMsg.getQuickMsgById);
    app.post('/vc/bulkEmail_quickMsg', quickMsg.bulkEmail_quickMsg);
    app.get('/vc/getStudListForCS/:schoolName/:clas/:section', event.getStudListForCS);
    app.get('/vc/getTeacherListForCS/:schoolName/:clas/:section', event.getTeacherListForCS);
    app.get('/vc/getToDate', event.getToDate);
    app.post('/vc/eventSend', event.eventSend);
    app.post('/vc/eventNotificationOff', event.eventNotificationOff);

    app.get('/vc/eventGet/:id', event.eventGet);
    app.post('/vc/eventReSchedule/:id', event.eventReSchedule);
    app.get('/vc/getEventById/:id', event.getEventById);
    app.get('/vc/getStudentAttendance/:id', event.getStudentAttendance);
    app.post('/vc/deleteEvent', event.deleteEvent);
    app.post('/vc/updateEventMOM/:eventId', event.updateEventMOM);
    app.post('/vc/parentCredential', event.parentCredential);

}

    //  app.post('/vc/uploadPayment', adminAction.uploadPayment);
    //app.post('/vc/csvTest', adminAction.csvTest);
    // app.post('/vc/atte', adminAction.getAllClass);

    //app.post('/vc/schoolLogo', image.upload);
        //app.post('/vc/eventReSchedule/:id', event.eventReSchedule);
    // app.get('/vc/eventGet/:id', event.eventGet);
        //app.post('/vc/eventUpdate/:id', event.eventUpdate);


    // app.get('/vc/teacherGet/:id', event.teacherGet);
