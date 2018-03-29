if (localStorage.getItem("userData")) {
    console.log("User Name from session: " + localStorage.getItem("userData"));
    var userData = JSON.stringify(localStorage.getItem("userData"));
    userName = localStorage.getItem("userName");
    loginType = localStorage.getItem("loginType");

    console.log("userData: " + userData);
    console.log("userName: " + userName);
    console.log("loginType: " + loginType);
    if (loginType == 'teacher' || loginType == 'admin') {
        document.getElementById("appLogin").style.display = 'none';
        document.getElementById("appReg").style.display = 'none';
        document.getElementById("appLogout").style.display = 'block';
        document.getElementById("userAuth").style.display = 'none';
       
    }
    else if (loginType == 'parent') {
        document.getElementById("appLogin").style.display = 'none';
        document.getElementById("appReg").style.display = 'none';
        document.getElementById("appLogout").style.display = 'block';
        document.getElementById("userAuth").style.display = 'none';
        
    }

   if(loginType == 'admin')
   {
    document.getElementById("userAuth").style.display = 'block';
   }
}
else {

    var url = window.location.href;
    var stuff = url.split('/');
    var id1 = stuff[stuff.length - 2];
    var id2 = stuff[stuff.length - 3];
    console.log("stuff.length: " + stuff.length);
    console.log("id1**: " + id1);
    console.log("id2**: " + id2);
    if (stuff.length > 5) {
        if (localStorage.getItem("userName")) {
            console.log("User Name from session: " + localStorage.getItem("userName"));
            userName = localStorage.getItem("userName");
            // startVideoAction();
            document.getElementById("appLogin").style.display = 'none';
            document.getElementById("appReg").style.display = 'none';
            document.getElementById("appLogout").style.display = 'block';
       }
        else {
            console.log("No user data from session");
            $('#setName').trigger('click');
            //    userName="logu";
            //     init();
        }

    }



}

function logVC() {
    console.log("logVC from signalingSocket.js");
    console.log("email: " + document.getElementById("crdEmail").value);
    var email = document.getElementById("crdEmail").value;
    var Password = document.getElementById('crdPswd').value;
    console.log("email: " + email);
    var obj = {
        "email": email,
        "password": Password
    };
    console.log("obj: " + JSON.stringify(obj));
    console.log("logVC");
    $.ajax({
        url: "https://vc4all.in/vc/login4VC",
        //  url: "http://localhost:5000/vc/login4VC",
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            console.log("data: " + JSON.stringify(data));
            if (data.message == 'Profile Inactive') {
                alert("Your Profile is inactive, inform your system admin to verify it");
            }
            else if (data.message == 'Login Successfully') {
                alert("Logged in Successfull");
                sessionSet(data);
                document.getElementById("appLogin").style.display = 'none';
                document.getElementById("appReg").style.display = 'none';
                document.getElementById("appLogout").style.display = 'block';
                userName = data.data.userName;
            }
            else if (data.message == 'Password is wrong') {
                alert("Password is wrong");
            }
            else if (data.errorCode == 'No Match') {
                alert("There is no match for this EMail id from student database ");
            }

            if (data.loginType == 'admin') {
                sessionSet(data);
                document.getElementById("appLogin").style.display = 'none';
                document.getElementById("appReg").style.display = 'none';
                document.getElementById("appLogout").style.display = 'block';
               

            }
        }

    })

}

function sessionSet(data) {
    if (typeof (Storage) !== "undefined") {
        var userData = {
            "userName": data.data.userName,
            "status": data.data.status,
            "email": data.data.email,
            "loginType": data.loginType
        }
        localStorage.setItem("userData", userData);
        localStorage.setItem("userName", data.data.userName);
        localStorage.setItem("status", data.data.status);
        localStorage.setItem("email", data.data.email);
        localStorage.setItem("loginType", data.loginType);
        localStorage.setItem("id", data.data._id);
        // Retrieve
        var info = localStorage.getItem("userData");

        userName = info.userName;

    } else {
        alert("Sorry, your browser does not support Web Storage...");

    }
}
function regVc() {
    console.log("regVc");
    var un = document.getElementById("regVC_un").value;
    var emId = document.getElementById("regVC_emailId").value;
    var pswd = document.getElementById("regVC_pswd").value;

    var obj = {
        "userName": un,
        "email": emId,
        "password": pswd
    };
    $.ajax({
        url: "https://vc4all.in/vc/register4VC",
        //url: "http://localhost:5000/vc/register4VC",
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            // callback(data);

            console.log("data: " + JSON.stringify(data));
            if (data.message == 'Failed to Register' || data.message == 'empty value found') {
                alert("Failed to register try again");
            }
            else if (data.message == 'Registeration Successfull') {
                alert("Registeration Successfull");


            }


        }

    })


}
function vcLogout() {
    console.log("vcLogout");
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("status");
    localStorage.removeItem("email");
    document.getElementById("appLogin").style.display = 'block';
    document.getElementById("appReg").style.display = 'none';
    document.getElementById("LoginUrl").style.display = 'block';
    document.getElementById("appLogout").style.display = 'none';
}