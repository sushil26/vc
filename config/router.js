
var image = require('./controllers/image');
var chatUpload = require('./controllers/chatUpload');

var careator = require('./controllers/careator');
var careator_event = require('./controllers/careator_event');
var careatorImgUpload = require('./controllers/careatorImgUploads.js');
var cAdminAction = require('./controllers/cAdminAction')

var record = require('./controllers/record');
var capture = require('./controllers/capture');

module.exports = function (app) {

    app.post('/careator/pswdGenerate', careator.pswdGenerate);
    app.post('/careator/pswdCheck', careator.pswdCheck);
    app.post('/careator/pswdCheckForSesstion', careator.pswdCheckForSesstion);
    app.post('/careator/pswdCheckForSession_schedule', careator.pswdCheckForSession_schedule);
    app.post('/careator/emailInvite', careator.emailInvite);
    app.post('/careator/RemoteJoinCheck', careator.RemoteJoinCheck);
    app.post('/careator/RemoteJoinCheck_schedule', careator.RemoteJoinCheck_schedule);
    app.post('/careator/setCollection', careator.setCollection);
    app.post('/chatHistory/getChatByUrl', careator.getChatByUrl);
    app.get('/chatHistory/getHistory', careator.getHistory);
    app.get('/chatHistory/getHistoryByEmailId/:email', careator.getHistoryByEmailId);
    app.post('/careator_profile/chatStatusUpdateById/:id', careator.chatStatusUpdateById);
    app.get('/careator_adminBasicData/getAdminObjectIdByOrgId/:orgId', careator.getAdminObjectIdByOrgId);
    app.get('/careator_adminBasicData/getSuperAdminObjectId', careator.getSuperAdminObjectId);
    app.get('/careator_adminBasicData/getAllAdminObjectIdByOrgId', careator.getAllAdminObjectIdByOrgId);
    app.post('/careator/careatorMasterInsert/:orgId', careator.careatorMasterInsert);
    app.post('/careator/careatorSingleUserInsert', careator.careatorSingleUserInsert);
    app.get('/careator/careator_getAllEmp/:orgId', careator.careator_getAllEmp);
    app.post('/careator/statusChangeById', careator.statusChangeById);
    app.post('/careator/groupStatusChangeById', careator.groupStatusChangeById);
    app.get('/careator_getChatListRecordById/getChatListRecordById/:id', careator.getChatListRecordById);
    app.get('/careator_userDelete/userDeleteById/:id', careator.userDeleteById);
    app.get('/careator_groupDelete/groupDeleteById/:id', careator.groupDeleteById);
    app.post('/careator/userEditById/:id', careator.userEditById);
    app.post('/careator/groupEditById/:id', careator.groupEditById);
    app.get('/careator_getUser/careator_getUserById/:id', careator.careator_getUserById);
    app.get('/careator_getGroup/careator_getGroupById/:id', careator.careator_getGroupById);
    app.get('/careator/getChatRights_emp/:orgId', careator.getChatRights_emp);
    app.get('/careator/getVideoRights_emp', careator.getVideoRights_emp);
    app.get('/careator/careator_getChatVideo_emp', careator.careator_getChatVideo_emp);
    app.post('/careator/careator_chat_creteGroup', careator.careator_chat_creteGroup);
    app.post('/careator_groupUpdate/groupUpdateById/:id', careator.groupUpdateById);
    app.post('/careator_restrictedTo/restrictedTo/:id', careator.restrictedTo);
    app.post('/careator_restrictedToSave/restrictedToSave/:id', careator.restrictedToSave);
    app.post('/careator_removeRestrictedUserById/removeRestrictedUserById/:id', careator.removeRestrictedUserById);
    app.get('/careator_getChatsById/getChatsById/:id', careator.getChatsById);
    app.get('/careator_loggedin/getLoggedinSessionURLById/:id', careator.getLoggedinSessionURLById);
    app.post('/careator_reset/resetLoginFlagsById/:id', careator.resetLoginFlagsById);
    app.post('/careator_textSeenFlagUpdate/textSeenFlagUpdate/:id', careator.textSeenFlagUpdate);
    app.post('/careator_textSeenFlagUpdate_toGroupChat/textSeenFlagUpdate_toGroupChat/:group_id', careator.textSeenFlagUpdate_toGroupChat);
    app.post('/careator_eventSchedule/careator_sendEventSchedule', careator_event.careator_sendEventSchedule);
    app.get('/careator_eventSchedule/careator_eventGetById/:id', careator_event.careator_eventGetById);
    app.get("/careator_getToDate/careator_getToDate", careator_event.careator_getToDate);
    //app.post('/careator/careator_video_creteGroup', careator.careator_video_creteGroup);
    //app.post('/careator/careator_chatVideo_creteGroup', careator.careator_chatVideo_creteGroup);

    app.get('/careator_chatGroupList/careator_getChatGroupListById/:id', careator.careator_getChatGroupListById);
    app.get('/careator_chatGroupList/careator_getChatGroupList/:orgId', careator.careator_getChatGroupList);
    app.post('/careator_getEmp/careator_getChatRightsAllemp/:id', careator.careator_getChatRightsAllemp);
    app.get('/careator_getEmp/careator_getChatRightsAllemp_byLoginId/:id/:orgId', careator.careator_getChatRightsAllemp_byLoginId);
    app.get('/careator_getEmp/careator_getChatRightsAllempWithSuperAdmin_byLoginId/:id/:orgId', careator.careator_getChatRightsAllempWithSuperAdmin_byLoginId);
    app.get('/careator_getEmp/careator_getAllAdmins_byLoginId/:id', careator.careator_getAllAdmins_byLoginId);
    app.post('/careator_individualText/individualText', careator.individualText);
    app.get('/careator_individualTextRead/individualTextReadById/:sId/:rId', careator.individualTextReadById);
    app.get('/careator_groupTextRead/groupTextReadByGroupId/:group_id', careator.groupTextReadByGroupId);
    app.post('/careator_groupText/groupText', careator.groupText);
    //app.get('/careator_groupTextRead/groupTextReadById/:sId/:rId', careator.groupTextReadById); /* Note: this api methos is not defining on the careator.js */

    app.post('/careator_comm_profileImgUpload/comm_profileImgUpload', careatorImgUpload.comm_profileImgUpload);
    app.post('/careator_comm_profileImgUpdateById/comm_profileImgUpdateById/:id', careator.comm_profileImgUpdateById);

    app.get('/careator/careator_getAllEmpLoginDetails/:orgId', careator.careator_getAllEmpLoginDetails);
    app.post('/careator_chatFileUpload/chatFileUpload', chatUpload.chatFileUpload);
    app.get('/careator_chatFileUpload/getChatFileUpload/:id', chatUpload.getChatFileUpload);

    app.post('/c/organizationCreate', cAdminAction.organizationCreate);
    app.get('/c/getAllAdmin', cAdminAction.getAllAdmin);
    app.get('/c/getAllOrg', cAdminAction.getAllOrg);
    app.post('/c/updateOrgStatus', cAdminAction.updateOrgStatus);
    app.get('/c/getOrg_admin_byOrgId/:id', cAdminAction.getOrg_admin_byOrgId);
    app.post('/c/orgEditById/:id', cAdminAction.orgEditById);
    app.post('/careator_getChatRightsAllemp_byLoginId')


}

