var careatorApp = angular.module('careatorCommApp', ['ui.router', 'angularjs-dropdown-multiselect', 'ngCookies','ngImgCrop']);

careatorApp.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('Cdashboard', {
            url: careator_dashboard(),
            templateUrl: '/careatorApp/html/careator_dashboard.html'

        })
        .state('Cdashboard.userCreate', {
            url: careator_userCreate(),
            templateUrl: '/careatorApp/html/createUsers.html'

        })
        .state('Cdashboard.createGroup', {
            url: createGroup(),
            templateUrl: '/careatorApp/html/createGroup.html'

        })
        .state('Cdashboard.usersListCtrl', {
            url: usersListCtrl(),
            templateUrl: '/careatorApp/html/userList.html'

        })
        .state('Cdashboard.groupListCtrl', {
            url: groupListCtrl(),
            templateUrl: '/careatorApp/html/groupList.html'

        })
        .state('Cdashboard.editUser', {
            url: editUser(),
            templateUrl: '/careatorApp/html/userEdit.html'

        }).state('Cdashboard.editGroup', {
            url: editGroup(),
            templateUrl: '/careatorApp/html/groupEdit.html'

        })
        .state('Cdashboard.chatHistory', {
            url: careator_chatHistory(),
            templateUrl: '/careatorApp/html/chatHistory.html'

        })
        .state('Cdashboard.chat', {
            url: careator_chat(),
            templateUrl: '/careatorApp/html/chat.html'

        })
        .state('Cdashboard.contactAdmin', {
            url: contactAdmin(),
            templateUrl: '/careatorApp/html/contactAdmin.html'
        })
        .state('Cdashboard.profile', {
            url: profile(),
            templateUrl: '/careatorApp/html/profile.html'
        })
        .state('Cdashboard.userRestrict', {
            url: careator_userRestrict(),
            templateUrl: '/careatorApp/html/userRestriction.html'

        })
})
function profile() {
    return '/profile';
}


function contactAdmin() {
    return '/contactAdmin';
}

function careator_dashboard() {
    return '/dashboard';
}

function editUser() {
    return '/editUser/:id';
}

function editGroup() {
    return '/editGroup/:id';
}

function groupListCtrl() {
    return '/groupList';
}

function usersListCtrl() {
    return '/usersList';
}

function careator_userCreate() {
    return '/userCreate';
}

function createGroup() {
    return '/createGroup';
}

function careator_chatHistory() {
    return '/chatHistory/:id';
}

function careator_chat() {
    return '/chat';
}

function careator_userRestrict() {
    return '/userRestrict'
}