var MAX_UPLOAD_SIZE = 1.5; // in MB
// var socket = io();
var count = 0;
var imageReader = new FileReader();
var videoReader = new FileReader();
var fileReader = new FileReader();

$('#fileselect').change(function (e) {

    console.log("FIle Select -->");
    file = e.target.files[0];
    console.log("file: " + file);
    console.log("file.type: " + file.type);


    console.log("<--FIle Select");
});
var date;
var time;
function DisplayCurrentTime(id) {
    console.log("DisplayCurrentTime-->");
    console.log("id: " + id);
    date = new Date();
    console.log("date: " + date);
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    console.log("time: " + time);
    var lblTime = document.getElementById(id);
    lblTime.innerHTML = time;

    console.log("<--DisplayCurrentTime");
};

function sendMessage() {
    console.log("sendMsg-->");
    var msg = document.getElementById('message').value;
    // var file = e.target.files[0];
    if (userName != null) {

        if (msg != null) {



            console.log("msg: " + msg);
            if (msg) {
                console.log("Start to emit message  ");
                console.log("peerNew_id: " + peerNew_id);
                signaling_socket.emit('textMsg', { 'message': msg, 'userId': peerNew_id, 'queryLink': queryLink, 'userName': userName });
                document.getElementById('message').value = "";
            }

        }
        else {
            console.log("You Didn't type any message")
        }
        if (file) {
            console.log("file.type.substring(0,5): " + file.type.substring(0, 5));
            console.log("file.type.substring(0,4): " + file.type.substring(0, 4));

            // if (file.type.substring(0, 5) === 'image' || file.type.substring(0, 5) === 'video' || file.type.substring(0, 4) === 'docx') {

            console.log("file.size: " + file.size);
            console.log("MAX_UPLOAD_SIZE: " + MAX_UPLOAD_SIZE + "MAX_UPLOAD_SIZE * 1000 * 1000: " + MAX_UPLOAD_SIZE * 1000 * 1000);
            if (file.size > MAX_UPLOAD_SIZE * 1000 * 1000) {
                alert('Sorry, we can only accept files up to ' + MAX_UPLOAD_SIZE + ' MB');
            }
            else if (file.type.substring(0, 5) === 'image') {
                console.log("Image");
                // upload image  
                imageReader.readAsDataURL(file);
            }
            else if (file.type.substring(0, 5) === 'video') {

                console.log("Video");
                // uplaod video  
                videoReader.readAsDataURL(file);
            }
            else {
                console.log("other from sendMessage");
                fileReader.readAsDataURL(file);
            }

            // }
            // else {
            //     alert("Sorry, you an only share images or videos or html Files");
            // }

            // reset select box and file object 
            $('#fileselect').val('');
            file = '';

        }
        else {
            console.log("You haven't selected any file to share");
        }
    }
    else {
        $('#setName').trigger('click');
    }
    console.log("<--Upload");

    console.log("<--sendMsg");
    return false; // don't reload the page


}

signaling_socket.on('newTextMsg', function (data) {

    console.log("newTextMsg-->");

    console.log("data.message: " + data.message);
    console.log("data.userId: " + data.userId);
    console.log("data.queryId: " + data.queryId);

    console.log("queryLink: " + queryLink);
    if (data.queryId == queryLink) {
        document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
            + data.userName + '</span></div><img class="fa fa-user direct-chat-img" aria-hidden="true"><!-- /.direct-chat-img --><div class="direct-chat-text">' + data.message + '</div><div class="direct-chat-info clearfix"><span id=' + data.message + ' class="direct-chat-timestamp pull-right"></span></div>'

        /* ##### Start Calling Get Time  ##### */
        DisplayCurrentTime(data.message);
        /* ##### End Calling Get Time  ##### */

        scrollDown();

        var chatOpen = $("#qnimate").hasClass("popup-box-on");
        if (chatOpen) {
            document.getElementById('chatNotification').style.display = 'none';

        }
        else {
            count = count + 1;

            document.getElementById('chatNotification').style.display = 'inline';
            document.getElementById('chatNotification').innerHTML = '(' + count + ')';
        }


    }
    else {

        console.log("newTextMsg: Sorry");
    }

    console.log("<--newTextMsg");

})


function emailInvite() {
    console.log("emailInvite-->");
    var email = document.getElementById('emailInvite').value;
    var URL = document.getElementById('linkToShare').innerHTML;
    console.log("email: " + email);
    console.log("URL: " + URL);
    if (email) {
        console.log("Start to emit email  ");
        console.log("peerNew_id: " + peerNew_id);
        signaling_socket.emit('emailCapture', { 'email': email, 'userId': peerNew_id, 'url': URL });
    }
    else {
        console.log("empty email");
    }

    console.log("<--emailInvite");

}

signaling_socket.on('emailSendInfo', function (data) {
    console.log("emailSendInfo-->");
    console.log("peerNew_id: " + peerNew_id);
    console.log("data.userId: " + data.userId);
    console.log("data.info: " + data.info);
    console.log("data.info: " + JSON.stringify(data));

    if (peerNew_id == data.userId) {
        // var label = document.createElement("label");
        // var txtNode = document.createTextNode(data.info);
        // label.appendChild(txtNode);

        // label.value = data.info;
        // console.log("label: "+label);

        document.getElementById('info').innerHTML = data.info;
    }
    else {

        console.log("emailSendInfo: Sorry");
    }

    console.log("<--emailSendInfo");

})






function playAudioForNotify() {
    console.log("playAudioForNotify-->");
    var snd = new Audio("./click.mp3"); // buffers automatically when created
    snd.play();
    console.log("<--playAudioForNotify");
}



/* #### Start File Sharing  ##### */




// Appends either an image or a video file to user's  window
function appendFile(URI, type, name, queryId) {
    console.log("appendFile-->");
    console.log("URI: " + URI);
    console.log("type: " + type);
    // console.log("user: "+user);

    if (queryId == queryLink) {
        if (type === 'image') {
            console.log("image");
            document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
                + name + '</span></div><img alt="iamgurdeeposahan" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" class="direct-chat-img"><!-- /.direct-chat-img --><div class="direct-chat-text"><img src="' + URI + '" height="100px" /></div><div class="direct-chat-info clearfix"><span id=' + URI + ' class="direct-chat-timestamp pull-right"></span></div>'

            /* ##### Start Calling Get Time  ##### */
            DisplayCurrentTime(URI);
            /* ##### End Calling Get Time  ##### */
            scrollDown();
        }
        else if (type === 'video') {
            console.log("video");
            document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
                + name + '</span></div><img alt="iamgurdeeposahan" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" class="direct-chat-img"><!-- /.direct-chat-img --><div class="direct-chat-text"><video width="320" height="240" controls><source src="' + URI + '"></div><div class="direct-chat-info clearfix"><span  id=' + URI + ' class="direct-chat-timestamp pull-right"></span></div>'

            /* ##### Start Calling Get Time  ##### */
            DisplayCurrentTime(URI);
            /* ##### End Calling Get Time  ##### */
            scrollDown();
        }
        else {
            console.log("Other");
            //             var save = document.createElement('a');
            // save.href = URI;
            // save.target = '_blank';
            // save.download = name || URI;
            // save.innerHTML="download"

            // var event = document.createEvent('Event');
            // event.initEvent('click', true, true);

            // save.dispatchEvent(event);
            // (window.URL || window.webkitURL).revokeObjectURL(save.href);
            document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
                + name + '</span></div> <img alt="iamgurdeeposahan" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" class="direct-chat-img"><!-- /.direct-chat-img --><div class="direct-chat-text"><a width="320" height="240" href=' + URI + ' target="_blank" download=' + URI + '><source src="' + URI + '">Download Here</a></div><div class="direct-chat-info clearfix"><span  id=' + URI + ' class="direct-chat-timestamp pull-right"></span></div>'

            /* ##### Start Calling Get Time  ##### */
            DisplayCurrentTime(URI);
            /* ##### End Calling Get Time  ##### */
            scrollDown();
        }


    }


    console.log("<--appendFile");
}


imageReader.onload = function (e) {
    console.log("imageReader.onload-->");
    scrollDown();
    var targetResult = e.target.result;

    // share image
    // TODO try stream?
    signaling_socket.emit('file', { 'userId': peerNew_id, 'queryLink': queryLink, 'userName': userName, 'dataURI': targetResult, 'type': 'image' });
    console.log("<--imageReader.onload");
};

videoReader.onload = function (e) {
    console.log("videoReader.onload-->");


    scrollDown();

    // share video
    signaling_socket.emit('file', e.target.result, 'video');
    console.log("<--videoReader.onload");
};
fileReader.onload = function (e) {
    console.log("fileReader.onload-->");

    scrollDown();
    var targetResult = e.target.result;

    // share image
    // TODO try stream?
    signaling_socket.emit('file', { 'userId': peerNew_id, 'queryLink': queryLink, 'userName': userName, 'dataURI': targetResult, 'type': 'doc' });
    console.log("<--fileReader.onload");
};

signaling_socket.on('file', function (data) {
    console.log("File Request from Server-->");
    console.log("data.queryLink: " + data.queryLink);
    console.log("queryLink: " + queryLink);
    if (data.queryId == queryLink) {
        appendFile(data.dataURI, data.type, data.userName, data.queryId);
    }
    console.log("<--File Request from Server");
    // appendFile(dataURI, type, from);
    scrollDown();

});

/* #### End File Sharing  ##### */


$(function () {
    $("#addChatWindow ").click(function () {
        $('#qnimate').addClass('popup-box-on');
        document.getElementById('chatNotification').style.display = 'none';
        count = 0;
    });

    $("#removeClass ").click(function () {
        $('#qnimate').removeClass('popup-box-on');
    });
})



