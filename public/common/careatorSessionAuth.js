careatorApp.factory('careatorSessionAuth', function($cookieStore) {
	console.log("careatorSessionAuth-->");
    var authFact={};
	authFact.setAccess=function(accessInfo){
		$cookieStore.put('accessInfo',accessInfo);
		//authFact.accessInfo=acessInfo;
	}
	authFact.getAccess=function(acessInfo){
		authFact.accessInfo=$cookieStore.get('accessInfo');
		return authFact.accessInfo;
	}
	authFact.getLoginType=function(acessInfo){
		var loginType=authFact.getLoginType().session.loginType;
		// console.log("authFact.accessInfo: "+JSON.stringify(authFact.accessInfo));
		return loginType;
	}
	authFact.clearAccess=function(){
		$cookieStore.remove("accessInfo");
	}
	authFact.checkPermission = function(){
        return true;             //returns the users permission level 
    }
	return authFact

})